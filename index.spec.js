const assert = require('node:assert')
const FileConverter = require('./src/file-converter')

;(async ()=>{
   
    {
        const filepath = 'mocks/emptyContent-invalid.csv'
        const expect = new Error('The length of content is invalid')

        const result = FileConverter.getFile(filepath)

        assert.rejects(result, expect)
    }

    {
        const filepath = 'mocks/fourLinesContent-invalid.csv'
        const expect = new Error('The length of content is invalid')

        const result = FileConverter.getFile(filepath)

        assert.rejects(result, expect)
    }

    {
        const filepath = 'mocks/header-invalid.csv'
        const expect = new Error('The headers of file have content invalid')

        const result = FileConverter.getFile(filepath)

        assert.rejects(result, expect)
    }

    {
        const filepath = 'mocks/threeLinesContent-valid.csv'
        const expect = [
            { id: 1, name: 'Tiago', profession: 'Developer', age: 35 },
            { id: 2, name: 'John',  profession: 'Manager',   age: 42 },
            { id: 3, name: 'Luana', profession: 'QA',        age: 18 }
        ]

        const result = await FileConverter.getFile(filepath)

        assert.deepEqual(result, expect)
    }
})()
