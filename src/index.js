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

const matchesSuperClass = (t, superClass, validClasses) => {
  let identifier;

  if (t.isIdentifier(superClass)) {
    identifier = superClass;
  } else if (
    t.isMemberExpression(superClass) &&
    t.isIdentifier(superClass.object, { name: 'React' })
  ) {
    identifier = superClass.property;
  }

  return identifier && validClasses.includes(identifier.name);
}

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

            if (!matchesSuperClass(t, cls.node.superClass, opts.superClasses)) {
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
