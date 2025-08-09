# ENS-Wordle Project Brief

## Project Overview

**ENS-Wordle** is a fun Web3 twist on the popular Wordle game where players guess ENS domain names using avatar images as visual clues. Instead of guessing regular words, players attempt to identify ENS names (like "vitalik.eth") with the help of the domain's associated avatar displayed at the start of each game.

### Core Game Mechanics
- Players have 6 attempts to guess the ENS name
- Traditional Wordle feedback system (green/yellow/gray letters for correct position/wrong position/not in word)
- Avatar image shown from the beginning as a visual hint
- Focus on 2LD names (second-level domains like "vitalik.eth") - players don't need to guess ".eth"
- Curated list of ENS names selected randomly for each game

## Target Audience

**Primary Users**: Web3 enthusiasts who are already familiar with ENS (Ethereum Name Service)
- Assumes existing knowledge of ENS concepts and Web3 identity
- Mobile-first experience optimized for casual gaming on phones/tablets

## Technical Architecture

### Technology Stack
- **Frontend**: Vite + React + TypeScript
- **Web3 Integration**: wagmi/viem for ENS data fetching
- **Styling**: Mobile-first responsive design
- **State Management**: Local storage for game progress

### Data Strategy
- **ENS Names**: Hardcoded curated list for initial version
- **Avatars**: Fetched dynamically using wagmi/viem
- **Fallback**: Placeholder image for ENS names without avatars
- **Game State**: Persisted locally in browser storage

## Project Scope & MVP Deliverables

### Core Features (v1)
1. **Game Interface**
   - Mobile-optimized game board
   - Avatar display area
   - 6-row guess input system
   - Letter feedback (green/yellow/gray)

2. **ENS Integration**
   - Dynamic avatar fetching via wagmi/viem
   - Placeholder handling for missing avatars
   - Hardcoded name list management

3. **Game Logic**
   - Standard Wordle mechanics adapted for ENS names
   - Local storage for game state persistence
   - Random name selection from curated list

### Technical Implementation
- Responsive web application
- No user accounts or wallet connection required
- Client-side only (no backend initially)
- Progressive web app capabilities for mobile experience

## Project Rationale

This is a fun experimental project exploring the intersection of popular gaming mechanics with Web3 identity systems. By combining the familiar Wordle format with ENS names and avatars, it creates an entertaining way for the Web3 community to engage with ENS domains while testing their knowledge of notable ENS holders.

The project prioritizes simplicity and immediate playability over complex features, making it an ideal learning project for Web3 development with wagmi/viem while delivering immediate value to the target audience.