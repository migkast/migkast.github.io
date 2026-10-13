import { describe, expect, it } from 'vitest';
import { formatRecordedAnswer } from '../../src/lib/clients/wheeler-answer-format';
describe('saved Wheeler answer formatting', () => {
 it('renders headings, emphasis, lists and tables', () => {
  const html=formatRecordedAnswer('### Providers\n\n**Wheeler**\n\n- First item\n\n| Provider | Scope |\n|---|---|\n| Wheeler | Supply |');
  expect(html).toContain('<h3>Providers</h3>');expect(html).toContain('<strong>Wheeler</strong>');expect(html).toContain('<li>First item</li>');expect(html).toContain('<table>');expect(html).toContain('<td>Supply</td>');
 });
 it('keeps safe links and removes executable model HTML', () => {
  const html=formatRecordedAnswer('[Wheeler](https://getwheelersteel.com/) <script>alert(1)</script> <img src=x onerror=alert(1)> [bad](javascript:alert)');
  expect(html).toContain('href="https://getwheelersteel.com/"');expect(html).toContain('rel="noopener noreferrer"');expect(html).not.toMatch(/<script|<img|onerror|javascript:/);
 });
});
