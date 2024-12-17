const PropertiesParser = {
    parse(str) {
        let lines = str.split("\n");
        let obj = {}
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trimStart();
            if (line.trim().length === 0 || line.startsWith("#")) continue
            let index = line.indexOf("=")
            if (index === -1) throw new Error("Error while parsing properties at line " + (i + 1) + " line text '" + line + "'")
            let key = line.substring(0, index).trim();
            let value = line.substring(index + 1).trimStart()
            obj[key] = value;
        }
        return obj
    }
}

const CssParser = {
    parse(str) {
        let lines = str.split(";");
        let obj = {}
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trimStart();
            let index = line.indexOf("=")
            if (index === -1) throw new Error("Error while parsing css at line " + (i + 1) + " line text '" + line + "'")
            let key = line.substring(0, index).trim();
            let value = line.substring(index + 1).trimStart()
            obj[key] = value;
        }
        return obj
    },
    stringify(obj) {
        let names = Object.getOwnPropertyNames(obj);
        let values = [];
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            let value = obj[name];
            if (typeof value === "string" && value) {
                value = value.trim()
                if (value.length === 0) continue
            }
            values.push([name,value].join(": "))
        }
        return values.join(";")
    }
}