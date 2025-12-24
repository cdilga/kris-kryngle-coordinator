// Core Kris Kringle allocation logic
// This module can be used both in the browser and in tests

/**
 * Fisher-Yates shuffle - ensures fair randomness
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Create allocations using the derangement algorithm
 * Shuffles the list, then assigns names[i] → names[(i + 1) % length]
 * This ensures everyone gives to someone and no one gives to themselves
 *
 * @param {string[]} namesList - Array of participant names
 * @returns {Object} - Object mapping giver to receiver
 */
export function createAllocations(namesList) {
    if (!namesList || namesList.length < 2) {
        throw new Error('Need at least 2 participants to create allocations');
    }

    // Shuffle the list to randomize who gets whom
    const shuffled = shuffleArray(namesList);

    // Create allocations: shuffled[i] → shuffled[(i + 1) % length]
    const allocations = {};
    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length];
        allocations[giver] = receiver;
    }

    return allocations;
}

/**
 * Validate that allocations form a proper derangement
 * (everyone gives to exactly one person, receives from exactly one person, no self-giving)
 *
 * @param {Object} allocations - The allocations to validate
 * @param {string[]} originalNames - The original list of names
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateAllocations(allocations, originalNames) {
    const givers = Object.keys(allocations);
    const receivers = Object.values(allocations);

    // Check that all original names are givers
    if (givers.length !== originalNames.length) return false;
    if (!originalNames.every(name => givers.includes(name))) return false;

    // Check that all original names are receivers
    if (!originalNames.every(name => receivers.includes(name))) return false;

    // Check that no one gives to themselves
    for (const [giver, receiver] of Object.entries(allocations)) {
        if (giver === receiver) return false;
    }

    // Check that it forms a single cycle (no partitioned cycles)
    const visited = new Set();
    let current = originalNames[0];
    for (let i = 0; i < originalNames.length; i++) {
        if (visited.has(current)) {
            // If we've visited this person before completing the cycle, it's partitioned
            return i === originalNames.length;
        }
        visited.add(current);
        current = allocations[current];
    }

    return visited.size === originalNames.length;
}
