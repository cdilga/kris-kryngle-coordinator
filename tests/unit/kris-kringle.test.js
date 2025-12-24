import { describe, it, expect } from 'vitest';
import { shuffleArray, createAllocations, validateAllocations } from '../../public/kris-kringle.js';

describe('Kris Kringle Allocation Tests', () => {
  describe('shuffleArray', () => {
    it('returns an array of the same length', () => {
      const input = ['Alice', 'Bob', 'Charlie'];
      const result = shuffleArray(input);
      expect(result.length).toBe(input.length);
    });

    it('contains all original elements', () => {
      const input = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const result = shuffleArray(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it('does not modify the original array', () => {
      const input = ['Alice', 'Bob', 'Charlie'];
      const original = [...input];
      shuffleArray(input);
      expect(input).toEqual(original);
    });

    it('handles empty arrays', () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it('handles single element arrays', () => {
      const result = shuffleArray(['Alice']);
      expect(result).toEqual(['Alice']);
    });
  });

  describe('createAllocations', () => {
    it('throws error for less than 2 participants', () => {
      expect(() => createAllocations([])).toThrow('Need at least 2 participants');
      expect(() => createAllocations(['Alice'])).toThrow('Need at least 2 participants');
    });

    it('creates allocations for 2 participants', () => {
      const names = ['Alice', 'Bob'];
      const allocations = createAllocations(names);

      expect(Object.keys(allocations).length).toBe(2);
      expect(allocations['Alice']).toBe('Bob');
      expect(allocations['Bob']).toBe('Alice');
    });

    it('ensures no one gives to themselves', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const allocations = createAllocations(names);

      for (const [giver, receiver] of Object.entries(allocations)) {
        expect(giver).not.toBe(receiver);
      }
    });

    it('ensures everyone is a giver', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const allocations = createAllocations(names);
      const givers = Object.keys(allocations);

      expect(givers.sort()).toEqual(names.sort());
    });

    it('ensures everyone is a receiver', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const allocations = createAllocations(names);
      const receivers = Object.values(allocations);

      expect(receivers.sort()).toEqual(names.sort());
    });

    it('creates a valid derangement (single cycle)', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const allocations = createAllocations(names);

      // Follow the chain - should visit everyone exactly once
      const visited = new Set();
      let current = names[0];
      for (let i = 0; i < names.length; i++) {
        expect(visited.has(current)).toBe(false);
        visited.add(current);
        current = allocations[current];
      }

      // After one complete cycle, should be back at start
      expect(current).toBe(names[0]);
      expect(visited.size).toBe(names.length);
    });

    it('works with larger groups', () => {
      const names = Array.from({ length: 10 }, (_, i) => `Person${i + 1}`);
      const allocations = createAllocations(names);

      expect(Object.keys(allocations).length).toBe(10);

      // Verify it's a valid derangement
      for (const [giver, receiver] of Object.entries(allocations)) {
        expect(giver).not.toBe(receiver);
      }
    });
  });

  describe('validateAllocations', () => {
    it('validates correct allocations', () => {
      const names = ['Alice', 'Bob', 'Charlie'];
      const allocations = {
        'Alice': 'Bob',
        'Bob': 'Charlie',
        'Charlie': 'Alice'
      };

      expect(validateAllocations(allocations, names)).toBe(true);
    });

    it('rejects self-giving', () => {
      const names = ['Alice', 'Bob', 'Charlie'];
      const allocations = {
        'Alice': 'Alice',  // Self-giving!
        'Bob': 'Charlie',
        'Charlie': 'Bob'
      };

      expect(validateAllocations(allocations, names)).toBe(false);
    });

    it('rejects missing participants', () => {
      const names = ['Alice', 'Bob', 'Charlie'];
      const allocations = {
        'Alice': 'Bob',
        'Bob': 'Alice'
        // Charlie is missing!
      };

      expect(validateAllocations(allocations, names)).toBe(false);
    });

    it('rejects partitioned cycles', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const allocations = {
        'Alice': 'Bob',
        'Bob': 'Alice',    // Cycle 1: Alice <-> Bob
        'Charlie': 'Diana',
        'Diana': 'Charlie' // Cycle 2: Charlie <-> Diana
      };

      expect(validateAllocations(allocations, names)).toBe(false);
    });

    it('validates generated allocations', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
      const allocations = createAllocations(names);

      expect(validateAllocations(allocations, names)).toBe(true);
    });

    // Run multiple iterations to test randomness
    it('generates valid allocations consistently', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];

      for (let i = 0; i < 100; i++) {
        const allocations = createAllocations(names);
        expect(validateAllocations(allocations, names)).toBe(true);
      }
    });
  });
});
