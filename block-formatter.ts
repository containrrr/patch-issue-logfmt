import * as logfmt from 'logfmt';
import matchAll from 'string.prototype.matchall'

export const findCodeBlocks = (source: string): ([string, number])[] => {
    const pat = /(^```\n)(.+?)^```/gms;
    return Array.from(matchAll(source, pat), (m: any) =>  [m[2], m.index + m[1].length]);
}


export const formatLogItem = (time: string, level: string, msg: string, fields: [key: string, value: any][]): string => {
    const levelChar = level[0].toUpperCase();

    // Only include timezone with hour resolution
    const trimmedTime = time.substr(0, 22);

    const prefix = `${trimmedTime} [${levelChar}] `;
    const prefixIndent = ' '.repeat(prefix.length)

    // LogItems is the `msg` field (including newlines) and other fields (each on a new line)
    const logItems = [msg ?? '', ...fields.map(([k, v]) => `${k}: ${v}`)].join('\n');

    // Indent all extra lines to line up with the prefix
    const lines = logItems.replace(/\n/g, '\n' + prefixIndent)
    return prefix + lines
}

export const patchCodeBlocks = (source: string): [patched: string, patchCount: number] => {

    const blocks = findCodeBlocks(source);
    console.log(`Blocks found: ${blocks.length}`)
    let patched = '';
    let logFmtMatches = 0
    let sourcePos = 0;
    for (const [blockContent, start] of blocks) {
        // Copy all unmatched lines between the last match and this one
        patched += source.substring(sourcePos, start)
        const blockLines = blockContent.split('\n').map(line => {
            const parsed = logfmt.parse(line.replace(/\\n/g, '\n'));
            const {time, level, msg} = parsed;

            if (time && level) {
                const fields = Object.entries(parsed)
                    .filter(([k]) => !['msg', 'level', 'time'].includes(k))
                logFmtMatches++
                return formatLogItem(time, level, msg, fields)
            } else {
                console.log(`!LF: ${line}`)
                // Did not include the usual log fields, probably not in logfmt, just skip it
                return line
            }
        })

        // Add the processed block lines to the output
        patched += blockLines.join('\n')

        // Update the source cursor to the end of the match
        sourcePos = start + blockContent.length;
    }

    // Copy all unmatched lines after the last match
    return [patched + source.substring(sourcePos), logFmtMatches]
}