import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Mock CSS.supports for Highcharts compatibility in Jest
global.CSS = {
  supports: jest.fn(() => false),
}
