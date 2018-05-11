class Catalog {

    constructor(id, name, type, productFamily) {
        this.id = id
        this.name = name
        this.type = type
        this.productFamily = productFamily
    }

    isProductFamily() {
        return this.productFamily
    }
}

export default Catalog
