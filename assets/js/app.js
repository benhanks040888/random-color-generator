jQuery.fn.selectText = function () {
  var a,
      b,
      c = document,
      d = this[0];
  c.body.createTextRange ? (a = document.body.createTextRange(), a.moveToElementText(d), a.select()) : window.getSelection && (b = window.getSelection(), a = document.createRange(), a.selectNodeContents(d), b.removeAllRanges(), b.addRange(a));
};

function getContrastYIQ(hexcolor) {
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

var ColorLabel = React.createClass({
  componentDidMount: function () {
    var clip = new Clipboard('.color-label');

    clip.on('success', function (e) {
      console.log(e);

      $('.color-label').selectText();
      $('.color-label').tooltip({
        title: 'Copied!'
      }).tooltip('show');

      setInterval(function () {
        $('.color-label').tooltip('destroy');
      }, 1500);
    });

    clip.on('error', function (e) {
      console.log(e);
      $('.color-label').tooltip({
        title: 'Press ⌘-C or Ctrl-C to copy!'
      }).tooltip('show');

      setInterval(function () {
        $('.color-label').tooltip('destroy');
      }, 1500);
    });
  },
  render: function () {
    return React.createElement(
      'span',
      { className: 'color-label', 'data-toggle': 'tooltip', 'data-clipboard-text': this.props.color },
      this.props.color
    );
  }
});

var ColorBox = React.createClass({
  componentWillMount: function () {
    this.replaceColor();
  },
  componentDidMount: function () {
    $(document).on('keydown', this.handleKeyDown);
    $('.color h1').addClass('text-' + getContrastYIQ(this.props.color.substring(1)));

    setInterval(function () {
      $('.color h1').fadeOut();
    }, 5000);
  },
  handleClick: function () {
    this.replaceColor();
  },
  handleKeyDown: function (e) {
    if (e.keyCode == 32) {
      this.replaceColor();
    }
  },
  generateColor: function () {
    return randomColor({ luminosity: 'random', hue: 'random' });
  },
  replaceColor: function () {
    var thisColor = this.generateColor();

    $('.color h1, .color-label').removeClass('text-white text-black');
    $('.color h1, .color-label').addClass('text-' + getContrastYIQ(thisColor.substring(1)));

    this.props.onColorChange(thisColor);
  },
  render: function () {
    var style = {
      backgroundColor: this.props.color
    };

    return React.createElement(
      'div',
      { className: 'color', style: style, onClick: this.handleClick },
      React.createElement(
        'h1',
        null,
        'Click anywhere or press space to generate random color'
      )
    );
  }
});

var ColorGnrtr = React.createClass({
  getInitialState: function () {
    return {
      color: ''
    };
  },
  componentDidMount: function () {
    FastClick.attach(document.body);
  },
  changeColor: function (color) {
    this.setState({
      color: color
    });
  },
  handleColorChange: function (color) {
    this.changeColor(color);
  },
  render: function () {
    return React.createElement(
      'div',
      null,
      React.createElement(ColorBox, { onColorChange: this.handleColorChange, color: this.state.color }),
      React.createElement(ColorLabel, { color: this.state.color })
    );
  }
});

ReactDOM.render(React.createElement(ColorGnrtr, null), document.getElementById('react_this'));