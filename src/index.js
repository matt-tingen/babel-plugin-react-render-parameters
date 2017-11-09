const defaults = {
  superClasses: ['Component', 'PureComponent']
};

const members = [
  { name: 'props' },
  { name: 'state', fallback: true },
  { name: 'context' },
];

const variableExpression = (t, member) => {
  const memberExpression = t.memberExpression(
    t.thisExpression(),
    t.identifier(member.name)
  );

  return member.fallback ?
    t.logicalExpression('||', memberExpression, t.objectExpression([])) :
    memberExpression;
};

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

            const params = path.get('params').slice(0, members.length);
            if (!params.length) {
              return;
            }

            const body = path.get('body');
            const declarators = params.map((param, i) => t.variableDeclarator(
              param.node,
              variableExpression(t, members[i])
            ));

            const declaration = t.variableDeclaration('const', declarators);
            body.unshiftContainer('body', declaration);

            params.forEach(param => {
              param.remove();
            });
          }
        });
      }
    }
  };
}
