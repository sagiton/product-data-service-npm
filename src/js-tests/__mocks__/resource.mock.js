function ResourceMock(val) {
    const self = this;
    this.val = val;

    class Resource {
        constructor() {}

        static get(val) {
            return new Method()
        }
    }

    class Method {
        constructor() {
            this.$promise = Promise.resolve(self.val)
        }
    }

    return Resource;
}

export default ResourceMock
