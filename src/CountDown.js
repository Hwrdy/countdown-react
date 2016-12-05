import React, { PureComponent, PropTypes } from 'react';
import styles from './CountDown.scss';

function getTimeRemaining(endTime) {
  const t = endTime - Date.now();
  const seconds = Math.floor((t / 1000) % 60);

  return seconds;
}

class CountDown extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
  };

  static defaultProps = {
    startTime: Date.now(),
  };

  constructor(props) {
    super(props);

    this.tickInterval = null;
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    this.renewCountDown(this.props.startTime);
  }

  componentWillReceiveProps(nextProps) {
    const { startTime } = this.props;

    if ((startTime !== nextProps.startTime)) {
      this.renewCountDown(nextProps.startTime);
    }
  }

  componentWillUnmount() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  }

  renewCountDown(newStartTime) {
    if (this.tickInterval && typeof window !== 'undefined') {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    const endTime = newStartTime + (60 * 1000);
    const count = getTimeRemaining(endTime);

    this.setState({
      count,
    }, () => {
      this.tickInterval = setInterval(this.handleTickSecond, 1000);
    });
  }

  handleTickSecond = () => {
    const { count } = this.state;
    const newCount = (count - 1 > 0) ? count - 1 : 0;

    this.setState({ count: newCount });
  }

  render() {
    const { size, className } = this.props;
    const { count } = this.state;
    const inlineSpinnerStyle = {
      width: size,
      height: size,
    };
    const inlineDescriptionStyle = {
      height: size,
      lineHeight: `${size}px`,
    };
    const wrapperClass = className || styles.wrapper;

    return (
      <div className={ wrapperClass }>
        <div className={ styles.spinner } style={ inlineSpinnerStyle }>
          <div className={ styles.r } />
          <span className={ styles.secs } >{ count }</span>
        </div>
        <div className={ styles.description } style={ inlineDescriptionStyle }>秒更新報價</div>
      </div>
    );
  }
}

export default CountDown;
