# ENS Name Curation Guidelines

## Selection Criteria

### Quality Standards
- **ENS Resolution**: Name must resolve successfully on Ethereum mainnet
- **Avatar Availability**: Strong preference for names with avatar records (80%+ of list)
- **Recognition Factor**: Names should be recognizable to Web3 community members
- **Length Variety**: Mix of 3-12 character names for gameplay variety

### Content Guidelines
- **Community Safe**: No controversial or potentially offensive names
- **Web3 Relevant**: Names should connect to blockchain/crypto/Web3 ecosystem
- **Educational Value**: Names help players learn about notable Web3 entities
- **Current Relevance**: Active or historically significant in Web3 space

### Technical Validation Requirements
- **ENS Resolution**: Must resolve to valid Ethereum address
- **Avatar Check**: Verify avatar record exists and loads successfully
- **Format Validation**: Only alphanumeric characters and hyphens
- **Length Constraints**: 3-12 characters (excluding .eth suffix)

## Difficulty Classification

### Easy (3-5 characters) - 25% of list
- **Criteria**: Short, well-known names
- **Examples**: ens, eth, btc, dao
- **Avatar Requirement**: 90%+ must have avatars

### Medium (6-8 characters) - 50% of list  
- **Criteria**: Recognizable projects/people
- **Examples**: vitalik, uniswap, compound
- **Avatar Requirement**: 80%+ must have avatars

### Hard (9+ characters) - 25% of list
- **Criteria**: Longer names, more challenging
- **Examples**: ethereum, blockchain, defi
- **Avatar Requirement**: 70%+ must have avatars (acceptable fallback rate)

## Category Distributions

### Notable Individuals (40%)
- Ethereum ecosystem leaders
- Project founders and core contributors
- Prominent Web3 personalities
- Community builders and influencers

### Projects/Protocols (35%)
- DeFi protocols and platforms
- NFT marketplaces and projects
- Infrastructure and tooling projects
- DAOs and governance tokens

### Generic/Descriptive (25%)
- Web3 terminology and concepts
- Popular crypto-related words
- Blockchain technology terms
- Community and culture references

## Validation Process

### Initial Screening
1. **Name Format Check**: Alphanumeric + hyphens only
2. **Length Validation**: 3-12 characters
3. **Content Review**: Appropriate for general audience
4. **Web3 Relevance**: Connected to blockchain ecosystem

### Technical Validation
1. **ENS Resolution**: Verify name resolves on mainnet
2. **Avatar Availability**: Check for avatar record
3. **Image Loading**: Verify avatar image loads successfully
4. **Fallback Testing**: Confirm placeholder works if avatar fails

### Quality Assurance
1. **Recognition Testing**: Sample Web3 users can identify 70%+ of names
2. **Difficulty Balance**: Gameplay testing confirms appropriate challenge levels
3. **Cultural Sensitivity**: Review for potentially problematic associations
4. **Legal Considerations**: Ensure no trademark or brand issues

## Maintenance and Updates

### Quarterly Reviews
- **Performance Analysis**: Track which names are too easy/hard
- **Community Feedback**: Incorporate player suggestions and requests  
- **Avatar Monitoring**: Check for broken or removed avatar images
- **Relevance Updates**: Add new notable names, retire outdated ones

### Version Control
- **Change Tracking**: Document all list modifications with rationale
- **Rollback Capability**: Maintain previous versions for quick rollback
- **Testing Protocol**: New names must pass full validation before inclusion
- **Communication**: Notify users of significant list updates

## Implementation Format

### Data Structure
```typescript
interface CuratedENSName {
  name: string;           // ENS name without .eth
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'individual' | 'project' | 'generic';
  hasAvatar: boolean;     // Known avatar status
  fallbackIcon?: string;  // Optional custom fallback
  addedDate: string;      // ISO date string
  lastValidated: string;  // Last technical validation
}
```

### Storage Format
- **JSON Array**: Easy to maintain and update
- **Type Safety**: Full TypeScript interface support
- **Metadata Rich**: Includes validation and categorization data
- **Version Controlled**: Git tracking for all changes

This framework ensures consistent quality while maintaining the educational and entertainment value of the ENS-Wordle experience.