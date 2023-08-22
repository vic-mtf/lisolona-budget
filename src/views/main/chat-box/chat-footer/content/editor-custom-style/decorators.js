import { CompositeDecorator } from "draft-js";
import createPrismDecorator from "draft-js-prism-decorator";

const prismDecorator = createPrismDecorator({
    getLanguage: () => 'html',
});
const decorators = new CompositeDecorator([prismDecorator]);
export default decorators;