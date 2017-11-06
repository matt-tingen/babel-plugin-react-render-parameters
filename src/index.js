const defaults = {
  superClasses: ['Component', 'PureComponent']
};

const paramNames = ['props', 'state', 'context'];

export default function({ types: t }) {
  return {
    visitor: {
      Program(path, state) {
        path.traverse({
          ClassMethod(path) {
            if (path.node.key.name !== 'render') {
              return;
            }

            const opts = { ...defaults, ...state.opts };
            const cls = path.findParent(path => path.isClassDeclaration());
            if (!opts.superClasses.includes(cls.node.superClass.name)) {
              return;
            }

            const params = path.get('params').slice(0, paramNames.length);
            if (!params.length) {
              return;
            }

            const body = path.get('body');
            const declarators = params.map((param, i) => {
              const name = paramNames[i];
              return t.variableDeclarator(
                param.node,
                t.memberExpression(t.thisExpression(), t.identifier(name))
              );
            });

            const declaration = t.variableDeclaration('const', declarators);
            path.get('body').unshiftContainer('body', declaration);

            params.forEach(param => {
              param.remove();
            });
          }
        });
      }
    }
  };
}
