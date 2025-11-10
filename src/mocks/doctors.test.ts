import { describe, it, expect } from 'vitest';
import { mockDoctors } from './doctors';

describe('Mock Doctors Data', () => {
  describe('mockDoctors array', () => {
    it('is defined as an array', () => {
      expect(Array.isArray(mockDoctors)).toBe(true);
    });

    it('contains 4 doctors', () => {
      expect(mockDoctors).toHaveLength(4);
    });

    it('exports a non-empty array', () => {
      expect(mockDoctors.length).toBeGreaterThan(0);
    });
  });

  describe('doctor object structure', () => {
    it('each doctor has required properties', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor).toHaveProperty('id');
        expect(doctor).toHaveProperty('name');
        expect(doctor).toHaveProperty('specialty');
        expect(doctor).toHaveProperty('image');
        expect(doctor).toHaveProperty('rating');
        expect(doctor).toHaveProperty('bio');
        expect(doctor).toHaveProperty('availability');
        expect(doctor).toHaveProperty('callTypes');
      });
    });

    it('each doctor has correct property types', () => {
      mockDoctors.forEach((doctor) => {
        expect(typeof doctor.id).toBe('number');
        expect(typeof doctor.name).toBe('string');
        expect(typeof doctor.specialty).toBe('string');
        expect(typeof doctor.image).toBe('string');
        expect(typeof doctor.rating).toBe('number');
        expect(typeof doctor.bio).toBe('string');
        expect(Array.isArray(doctor.availability)).toBe(true);
        expect(Array.isArray(doctor.callTypes)).toBe(true);
      });
    });
  });

  describe('doctor data validation', () => {
    it('all doctor IDs are unique', () => {
      const ids = mockDoctors.map((doc) => doc.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(mockDoctors.length);
    });

    it('all doctor IDs are positive numbers', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.id).toBeGreaterThan(0);
        expect(Number.isInteger(doctor.id)).toBe(true);
      });
    });

    it('all doctor names are non-empty strings', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.name.length).toBeGreaterThan(0);
      });
    });

    it('all doctor specialties are non-empty strings', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.specialty.length).toBeGreaterThan(0);
      });
    });

    it('all ratings are between 0 and 5', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.rating).toBeGreaterThanOrEqual(0);
        expect(doctor.rating).toBeLessThanOrEqual(5);
      });
    });

    it('all doctor images are valid URLs', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.image).toMatch(/^https?:\/\//);
      });
    });

    it('all doctor bios are non-empty strings', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.bio.length).toBeGreaterThan(0);
      });
    });

    it('all doctors have availability slots', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.availability.length).toBeGreaterThan(0);
      });
    });

    it('all availability slots are valid ISO datetime strings', () => {
      mockDoctors.forEach((doctor) => {
        doctor.availability.forEach((slot) => {
          expect(slot).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        });
      });
    });

    it('all doctors have call types', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.callTypes.length).toBeGreaterThan(0);
      });
    });

    it('all call types are valid options', () => {
      const validCallTypes = ['phone', 'video', 'voice'];
      mockDoctors.forEach((doctor) => {
        doctor.callTypes.forEach((callType) => {
          expect(validCallTypes).toContain(callType);
        });
      });
    });
  });

  describe('specific doctor data', () => {
    it('Alice Smith is a Psychiatrist', () => {
      const alice = mockDoctors[0];
      expect(alice.name).toBe('Dr. Alice Smith');
      expect(alice.specialty).toBe('Psychiatrist');
    });

    it('Alice Smith has phone and video call types', () => {
      const alice = mockDoctors[0];
      expect(alice.callTypes).toContain('phone');
      expect(alice.callTypes).toContain('video');
    });

    it('Bob Johnson is a Clinical Psychologist', () => {
      const bob = mockDoctors[1];
      expect(bob.name).toBe('Dr. Bob Johnson');
      expect(bob.specialty).toBe('Clinical Psychologist');
    });

    it('Bob Johnson has video and voice call types', () => {
      const bob = mockDoctors[1];
      expect(bob.callTypes).toContain('video');
      expect(bob.callTypes).toContain('voice');
    });

    it('Carol Lee (Child Psychologist) has phone and voice call types', () => {
      const carol = mockDoctors[2];
      expect(carol.name).toBe('Dr. Carol Lee');
      expect(carol.specialty).toBe('Child Psychologist');
      expect(carol.callTypes).toContain('phone');
      expect(carol.callTypes).toContain('voice');
    });

    it('fourth doctor is Carol Lee (Marriage Psychologist)', () => {
      const carol = mockDoctors[3];
      expect(carol.name).toBe('Dr. Carol Lee');
      expect(carol.specialty).toBe('Marriage Psychologist');
      expect(carol.callTypes).toContain('video');
    });

    it('Alice has high rating of 4.8', () => {
      const alice = mockDoctors[0];
      expect(alice.rating).toBe(4.8);
    });

    it('Carol Lee (Child Psychologist) has highest rating of 4.9', () => {
      const carol = mockDoctors[2];
      expect(carol.rating).toBe(4.9);
    });
  });

  describe('doctor availability data', () => {
    it('Alice has at least 3 available slots', () => {
      const alice = mockDoctors[0];
      expect(alice.availability.length).toBeGreaterThanOrEqual(3);
    });

    it('Bob has at least 2 available slots', () => {
      const bob = mockDoctors[1];
      expect(bob.availability.length).toBeGreaterThanOrEqual(2);
    });

    it('availability slots are in datetime format', () => {
      mockDoctors.forEach((doctor) => {
        doctor.availability.forEach((slot) => {
          expect(slot).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        });
      });
    });

    it('availability slots are valid dates', () => {
      mockDoctors.forEach((doctor) => {
        doctor.availability.forEach((slot) => {
          const date = new Date(slot);
          expect(date.toString()).not.toBe('Invalid Date');
        });
      });
    });
  });

  describe('doctor descriptions', () => {
    it('Alice specializes in cognitive behavioral therapy', () => {
      const alice = mockDoctors[0];
      expect(alice.bio).toContain('cognitive behavioral therapy');
    });

    it('Bob specializes in depression and trauma', () => {
      const bob = mockDoctors[1];
      expect(bob.bio).toContain('depression');
      expect(bob.bio).toContain('trauma');
    });

    it('Child psychologist Carol focuses on child development', () => {
      const carol = mockDoctors[2];
      expect(carol.bio).toContain('child development');
    });

    it('Marriage psychologist Carol focuses on relationships', () => {
      const carol = mockDoctors[3];
      expect(carol.bio).toContain('marriage counseling');
      expect(carol.bio).toContain('relationship');
    });
  });

  describe('doctor images', () => {
    it('all doctor images use randomuser.me service', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.image).toContain('randomuser.me');
      });
    });

    it('all doctor images have /portraits/ path', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.image).toContain('/portraits/');
      });
    });

    it('doctor images indicate gender (men/women)', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.image).toMatch(/\/(men|women)\/\d+\.jpg$/);
      });
    });

    it('Alice and Carol (female doctors) use women images', () => {
      const alice = mockDoctors[0];
      const carol1 = mockDoctors[2];
      const carol2 = mockDoctors[3];

      expect(alice.image).toContain('/women/');
      expect(carol1.image).toContain('/women/');
      expect(carol2.image).toContain('/women/');
    });

    it('Bob (male doctor) uses men image', () => {
      const bob = mockDoctors[1];
      expect(bob.image).toContain('/men/');
    });
  });

  describe('mock data diversity', () => {
    it('includes different specialties', () => {
      const specialties = mockDoctors.map((doc) => doc.specialty);
      const uniqueSpecialties = new Set(specialties);
      expect(uniqueSpecialties.size).toBeGreaterThan(1);
    });

    it('includes various rating ranges', () => {
      const ratings = mockDoctors.map((doc) => doc.rating);
      const minRating = Math.min(...ratings);
      const maxRating = Math.max(...ratings);
      expect(maxRating - minRating).toBeGreaterThan(0);
    });

    it('includes different call type combinations', () => {
      const callTypeStrings = mockDoctors.map((doc) => doc.callTypes.join(','));
      const uniqueCombinations = new Set(callTypeStrings);
      expect(uniqueCombinations.size).toBeGreaterThan(1);
    });
  });

  describe('mock data consistency', () => {
    it('provides realistic mock data for testing', () => {
      expect(mockDoctors[0]).toHaveProperty('name', expect.any(String));
      expect(mockDoctors[0]).toHaveProperty('specialty', expect.any(String));
      expect(mockDoctors[0]).toHaveProperty('rating', expect.any(Number));
    });

    it('all properties are initialized', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.id).toBeDefined();
        expect(doctor.name).toBeDefined();
        expect(doctor.specialty).toBeDefined();
        expect(doctor.image).toBeDefined();
        expect(doctor.rating).toBeDefined();
        expect(doctor.bio).toBeDefined();
        expect(doctor.availability).toBeDefined();
        expect(doctor.callTypes).toBeDefined();
      });
    });

    it('no properties are null or undefined', () => {
      mockDoctors.forEach((doctor) => {
        expect(doctor.id).not.toBeNull();
        expect(doctor.name).not.toBeNull();
        expect(doctor.specialty).not.toBeNull();
        expect(doctor.image).not.toBeNull();
        expect(doctor.rating).not.toBeNull();
        expect(doctor.bio).not.toBeNull();
        expect(doctor.availability).not.toBeNull();
        expect(doctor.callTypes).not.toBeNull();
      });
    });
  });
});
