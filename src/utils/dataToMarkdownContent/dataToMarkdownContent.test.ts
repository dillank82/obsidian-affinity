import { dataToMarkdownContent } from "./dataToMarkdownContent"

describe('dataToMarkdownContent', () => {

  it('should return correct structure', () => {
    expect(
      dataToMarkdownContent({
        id: 'bb357792-c996-40cd-ab9e-ed78ae623ef5',
        toCharId: 'bf5337ad-b689-4d0c-9048-1a44ffbe35e9'
      })
    ).toMatchInlineSnapshot(`
"\`\`\`affinity
  id: bb357792-c996-40cd-ab9e-ed78ae623ef5
  toCharId: bf5337ad-b689-4d0c-9048-1a44ffbe35e9
\`\`\`
"
`)
  })

  it('should correctly handle missing toChar', () => {
    expect(dataToMarkdownContent({ id: 'bb357792-c996-40cd-ab9e-ed78ae623ef5', toCharId: null })).toMatchInlineSnapshot(`
"\`\`\`affinity
  id: bb357792-c996-40cd-ab9e-ed78ae623ef5
\`\`\`
"
`)
  })
})