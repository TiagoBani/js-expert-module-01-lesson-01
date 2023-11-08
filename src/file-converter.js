const {readFile} = require('node:fs/promises')

const errors = Object.freeze({
    FILE_LENGTH_SIZE_INVALID: 'The length of content is invalid',
    HEADERS_INVALID: 'The headers of file have content invalid',
})

const config = Object.freeze({
    headers: ['id','name','profession','age'],
    content: {
        length: 3
    }
})

class FileConverter {

    /**
     * @param {string} filepath
     * @returns {Promise<{id: number, name: string, profession: string, age: number}[]>} 
    */
    static async getFile(filepath){
        const file = await readFile(filepath, 'utf-8')
        const [header, ...content] = file.split(/\r?\n/gi)

        const validation = this.validate({header, content})
        if(!validation.valid) throw new Error(validation.error)

        return this.parseCSVtoJSON({header, content})
    }

    /**
     * @param {Object} params 
     * @param {string} params.header 
     * @param {string[]} params.content 
     * 
     * @returns {{valid: boolean, error?: string}}
    */
    static validate({header, content}){
        if(!content.length || content.length > config.content.length) 
            return {valid: false, error: errors.FILE_LENGTH_SIZE_INVALID}

        const headerArr = header.split(',')
        
        if(
            headerArr.length !== config.headers.length || 
            headerArr.filter(item => !config.headers.includes(item)).length > 0
        ) 
            return {valid: false, error: errors.HEADERS_INVALID}
        
        return {valid: true}
    }

    /**
     * @param {Object} params 
     * @param {string} params.header 
     * @param {string[]} params.content 
     * 
     * @returns {{id: number, name: string, profession: string, age: number}[]}
    */
    static parseCSVtoJSON({header, content}) {
        
        const linesToJson = []
        const headerFile = header.split(',')
        
        for(const line of content){
            const obj = {}
            const contentFile = line.split(',')
            
            headerFile.forEach((item, i) => Object.assign(obj, {[item]: `${contentFile[i]}`.trim()}))
            
            linesToJson.push(obj)
        }

        return linesToJson
    }
}

module.exports = FileConverter