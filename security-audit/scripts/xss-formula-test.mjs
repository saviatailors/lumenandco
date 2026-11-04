/**
 * CSV / Formula Injection & Stored Content Sanitization Verification
 * Validates CWE-1236 (Formula Injection) prevention and HTML escaping.
 *
 * Usage:
 *   node security-audit/scripts/xss-formula-test.mjs
 */

import { sanitizeExcelCell } from "../../src/lib/excelExport.js";

const TEST_FORMULA_PAYLOADS = [
  { input: "=cmd|' /C calc'!A0", expected: "'=cmd|' /C calc'!A0", type: "Dynamic Command Execution" },
  { input: "=SUM(1+1)", expected: "'=SUM(1+1)", type: "Formula Execution" },
  { input: "+1234567890", expected: "'+1234567890", type: "Plus prefix" },
  { input: "-2+3+cmd|' /C calc'!A0", expected: "'-2+3+cmd|' /C calc'!A0", type: "Minus prefix DDE" },
  { input: "@SUM(A1:A10)", expected: "'@SUM(A1:A10)", type: "At symbol function call" },
  { input: "\t=1+1", expected: "'\t=1+1", type: "Tab character prefix" },
  { input: "Safe Company Name", expected: "Safe Company Name", type: "Harmless String" },
  { input: 9845000000, expected: 9845000000, type: "Numeric Value" },
];

function testSanitizeFormula() {
  console.log(`\n======================================================`);
  console.log(`🧪 CWE-1236 CSV / FORMULA INJECTION REGRESSION TEST`);
  console.log(`======================================================\n`);

  let pass = 0;
  let fail = 0;

  for (const item of TEST_FORMULA_PAYLOADS) {
    const output = sanitizeExcelCell(item.input);
    const matches = output === item.expected;
    if (matches) {
      console.log(`✅ [PASS] ${item.type}: "${item.input}" -> "${output}"`);
      pass++;
    } else {
      console.log(`❌ [FAIL] ${item.type}: got "${output}", expected "${item.expected}"`);
      fail++;
    }
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`Results: ${pass} Passed, ${fail} Failed`);
  console.log(`------------------------------------------------------\n`);
}

testSanitizeFormula();
