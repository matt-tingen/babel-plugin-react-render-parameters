const defaults = {
  superClasses: ['Component', 'PureComponent']
};

export default function({ types: t }) {
  return {
    visitor: {
      ClassMethod(path, state) {
        if (path.node.key.name !== 'render') {
          return;
        }

        const superClasses = state.opts.superClasses || defaults.superClasses;
        const cls = path.findParent(path => path.isClassDeclaration());
        if (!superClasses.includes(cls.node.superClass.name)) {
          return;
        }

        const paramNames = ['props', 'state'];
        const params = path.get('params').slice(0, paramNames.length);
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
    }
  };
}
