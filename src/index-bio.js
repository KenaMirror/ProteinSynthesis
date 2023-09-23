const BIO = function () {
    let nucleotides = []


    /**
     * @param {number} id
     * @param {string} bundleName
     * @param {string} endName
     * @param {number[]} color
     * */
    function makeNucleotide(id, bundleName, endName, color) {
        let colors = []
        colors.push("rgb(" + (color[0] * 0.6) + ", " + (color[1] * 0.6) + ", " + (color[2] * 0.6) + ")")
        colors.push("rgb(" + (color[0] * 0.7) + ", " + (color[1] * 0.7) + ", " + (color[2] * 0.7) + ")")
        colors.push("rgb(" + (color[0] * 0.8) + ", " + (color[1] * 0.8) + ", " + (color[2] * 0.8) + ")")
        let tmp = {
            id: id,
            name: BUNDLE[bundleName],
            charName: BUNDLE[bundleName].charAt(0),
            styleId: endName,
            colors: colors,
            index: nucleotides.length
        }
        nucleotides.push(tmp)
        return tmp
    }//Adenine

    let obj = {

        Nucleotide: function () {
            let obj = {
                Thymine: makeNucleotide(0, "nucleotide.thymine", "T", [0xD8, 0x64, 0x67]),
                Uracil: makeNucleotide(0, "nucleotide.uracil", "U", [0xDB, 0x92, 0x65]),
                Cytosine: makeNucleotide(1, "nucleotide.cytosine", "C", [0x66, 0x92, 0xD9]),
                Adenine: makeNucleotide(2, "nucleotide.adenine", "A", [0xE7, 0x79, 0x7C]),
                Guanine: makeNucleotide(3, "nucleotide.guanine", "G", [0x67, 0xda, 0x65]),
                all: nucleotides,
                rnaById: function (id) {
                    return nucleotides[id + 1]
                }
            }
            let names_ = Object.getOwnPropertyNames(obj);
            for (let i = 0; i < names_.length; i++) {
                obj[names_[i]].enumName = names_[i]
            }
            obj.rna = [obj.Uracil, obj.Cytosine, obj.Adenine, obj.Guanine]
            obj.dna = [obj.Thymine, obj.Cytosine, obj.Adenine, obj.Guanine]
            return obj;
        }(),
        AminoAcid: function () {
            let aminoAcid = {
                Phe: {}, Leu: {}, Ser: {}, Tyr: {},
                Stop: {}, Cys: {}, Trp: {}, Pro: {},
                His: {}, Gln: {}, Arg: {}, Ile: {},
                Met: {}, Thr: {}, Asn: {}, Lys: {},
                Val: {}, Ala: {}, Asp: {}, Glu: {},
                Gly: {}
            }
            let counter = 0;
            let all = []
            let active = []

            function Codon(aminoAcid, x, y, z) {
                return {
                    acid: aminoAcid,
                    name: aminoAcid.title,
                    x: x,
                    y: y,
                    z: z,
                    nucleotides() {
                        return [BIO.Nucleotide.rnaById(this.x), BIO.Nucleotide.rnaById(this.y), BIO.Nucleotide.rnaById(this.z)]
                    }
                }

            }

            function AminoAcid(name) {
                let obj = {}
                obj.name = name
                obj.id = counter
                obj.positions = []
                // noinspection EqualityComparisonWithCoercionJS
                if (name != "Met" && name != "Stop") {
                    active.push(obj)
                }
                all.push(obj)
                counter++;
                return obj
            }

            let names = Object.getOwnPropertyNames(aminoAcid)
            for (let i = 0; i < names.length; i++) {
                aminoAcid[names[i]] = AminoAcid(names[i])
                aminoAcid[names[i]].title = BUNDLE["amino-acid." + names[i].toLowerCase()] //aminoAcidRaw[names[i]]
            }
            aminoAcid.active = active
            aminoAcid.all = all
            let a = aminoAcid
            aminoAcid.matrix = [
                [[a.Phe, a.Phe, a.Leu, a.Leu], [a.Ser, a.Ser, a.Ser, a.Ser], [a.Tyr, a.Tyr, a.Stop, a.Stop], [a.Cys, a.Cys, a.Stop, a.Trp]],
                [[a.Leu, a.Leu, a.Leu, a.Leu], [a.Pro, a.Pro, a.Pro, a.Pro], [a.His, a.His, a.Gln, a.Gln], [a.Arg, a.Arg, a.Arg, a.Arg]],
                [[a.Ile, a.Ile, a.Ile, a.Met], [a.Thr, a.Thr, a.Thr, a.Thr], [a.Asn, a.Asn, a.Lys, a.Lys], [a.Ser, a.Ser, a.Arg, a.Arg]],
                [[a.Val, a.Val, a.Val, a.Val], [a.Ala, a.Ala, a.Ala, a.Ala], [a.Asp, a.Asp, a.Glu, a.Glu], [a.Gly, a.Gly, a.Gly, a.Gly]]
            ]

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    for (let k = 0; k < 4; k++) {
                        let acid = aminoAcid.matrix[i][j][k];
                        acid.positions.push(Codon(acid, i, j, k))
                    }
                }
            }
            return aminoAcid
        }()
    }
    return obj
}()