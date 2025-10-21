1. generate the file by `cd here && node generate-big-data.js`
2. copy the file into src dir
3. Add `export * from './big-data.generated.js';` to `src/index.ts`
4. use the bigDataTreeShakingTest js object in the consumer app
5. build the consumer app
6. check in bundled files that "Generated description for item" text is present, it should
7. then uncomment the line oof point 3
8. build the consumer app againg
9. check in bundled files that "Generated description for item" text is not present, it should not be present