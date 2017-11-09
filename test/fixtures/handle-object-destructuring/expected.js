class Test extends Component {
  render() {
    const { p1 } = this.props,
          { s1, s2 } = this.state || {},
          { c1 } = this.context;

    return React.createElement('div', null);
  }
}
