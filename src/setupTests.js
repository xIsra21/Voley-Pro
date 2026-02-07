import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extiende los comandos de expect de Vitest con los de Testing Library
expect.extend(matchers);

afterEach(() => {
  cleanup();
});