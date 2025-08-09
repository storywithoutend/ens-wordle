/**
 * ENS service for fetching avatar data
 */

import { publicClient, ENS_CONFIG } from '../config/wagmi';
import type { ENSData, ENSError } from '../types';

/**
 * Fetches ENS avatar URL with timeout and fallback handling
 */
export async function fetchENSAvatar(ensName: string): Promise<string | null> {
  try {
    // Add .eth suffix if not present
    const fullName = ensName.includes('.') ? ensName : `${ensName}.eth`;

    console.log(`[ENS] Fetching avatar for: ${fullName}`);

    // Create timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(
        () => reject(new Error('Avatar fetch timeout')),
        ENS_CONFIG.AVATAR_TIMEOUT
      );
    });

    // Fetch avatar with timeout
    const avatarPromise = publicClient.getEnsAvatar({
      name: fullName,
    });

    const avatarUrl = await Promise.race([avatarPromise, timeoutPromise]);

    if (avatarUrl) {
      console.log(`[ENS] Avatar found: ${avatarUrl}`);

      // Validate that the image URL is accessible
      const isValidImage = await validateImageUrl(avatarUrl);
      if (isValidImage) {
        return avatarUrl;
      } else {
        console.warn(`[ENS] Avatar URL not accessible: ${avatarUrl}`);
        return null;
      }
    } else {
      console.log(`[ENS] No avatar found for: ${fullName}`);
      return null;
    }
  } catch (error) {
    console.error(`[ENS] Error fetching avatar for ${ensName}:`, error);
    return null;
  }
}

/**
 * Validates that an image URL is accessible and returns an image
 */
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      timeout: 2000,
    } as RequestInit);

    const contentType = response.headers.get('content-type');
    return (
      response.ok && contentType !== null && contentType.startsWith('image/')
    );
  } catch {
    return false;
  }
}

/**
 * Resolves ENS name to get basic information
 */
export async function resolveENSName(ensName: string): Promise<ENSData | null> {
  try {
    const fullName = ensName.includes('.') ? ensName : `${ensName}.eth`;

    console.log(`[ENS] Resolving: ${fullName}`);

    // Create timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(
        () => reject(new Error('ENS resolution timeout')),
        ENS_CONFIG.RESOLUTION_TIMEOUT
      );
    });

    // Resolve address with timeout
    const addressPromise = publicClient.getEnsAddress({ name: fullName });
    const address = await Promise.race([addressPromise, timeoutPromise]);

    if (address) {
      console.log(`[ENS] Resolved ${fullName} to: ${address}`);

      // Fetch avatar (optional)
      const avatar = await fetchENSAvatar(ensName);

      return {
        name: fullName,
        address,
        avatar: avatar || undefined,
        displayName: ensName, // Just the name without .eth for display
      };
    } else {
      console.warn(`[ENS] Could not resolve: ${fullName}`);
      return null;
    }
  } catch (error) {
    console.error(`[ENS] Error resolving ${ensName}:`, error);
    return null;
  }
}

/**
 * Validates ENS name format
 */
export function validateENSName(name: string): boolean {
  // Basic validation for ENS name format
  if (!name || typeof name !== 'string') return false;

  // Remove .eth suffix for validation
  const baseName = name.replace(/\.eth$/, '');

  // Check length (3-63 characters for domain names)
  if (baseName.length < 3 || baseName.length > 63) return false;

  // Check for valid characters (alphanumeric and hyphens)
  if (!/^[a-zA-Z0-9-]+$/.test(baseName)) return false;

  // Can't start or end with hyphen
  if (baseName.startsWith('-') || baseName.endsWith('-')) return false;

  return true;
}

/**
 * Creates an ENS error object
 */
export function createENSError(
  type: ENSError['type'],
  message: string,
  ensName?: string,
  originalError?: Error
): ENSError {
  return {
    type,
    message,
    ensName,
    originalError,
  };
}

/**
 * Batch validate multiple ENS names (for development/testing)
 */
export async function batchValidateENSNames(names: string[]): Promise<{
  valid: string[];
  invalid: string[];
  results: Record<string, ENSData | null>;
}> {
  const results: Record<string, ENSData | null> = {};
  const valid: string[] = [];
  const invalid: string[] = [];

  console.log(`[ENS] Batch validating ${names.length} names...`);

  // Process names in parallel but with some delay to avoid rate limiting
  const promises = names.map(
    (name, index) =>
      new Promise<void>(resolve => {
        setTimeout(async () => {
          try {
            const result = await resolveENSName(name);
            results[name] = result;

            if (result) {
              valid.push(name);
            } else {
              invalid.push(name);
            }
          } catch (error) {
            console.error(`[ENS] Batch validation failed for ${name}:`, error);
            results[name] = null;
            invalid.push(name);
          }
          resolve();
        }, index * 100); // 100ms delay between requests
      })
  );

  await Promise.all(promises);

  console.log(
    `[ENS] Batch validation complete: ${valid.length} valid, ${invalid.length} invalid`
  );

  return { valid, invalid, results };
}
