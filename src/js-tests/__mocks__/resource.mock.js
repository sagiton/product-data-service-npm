function ResourceMock(val) {
    const self = this;
    this.val = val;

    class Resource {

        constructor(args) {
            this.args = args
        }

        static get(val) {
            return new Method()
        }

        static $template() {}
    }

    class Method {
        constructor() {
            this.$promise = Promise.resolve(self.val)
        }
    }

    return Resource;
}

export default ResourceMock
