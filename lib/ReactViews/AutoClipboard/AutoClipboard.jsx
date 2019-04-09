import clipboard from 'clipboard';
import React from 'react';
import Styles from './autoclipboard.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from "../Icon.jsx";

// wip - either add back to clipboard if not doing async fallback, or use this for async clipboard
export default class AutoClipboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltip: null,
            success: null,
        };
        this.resetTooltipLater = this.resetTooltipLater.bind(this);
    }

    componentDidMount() {
        this.clipboardBtn = new clipboard(`.btn-copy-${this.props.id}`, );
        this.clipboardBtn.on('success', _ => {
            this.setState({
                tooltip: "Copied to clipboard",
                success: true,
            });
            this.resetTooltipLater();
        });
        this.clipboardBtn.on('error', _ => {
            this.setState({
                tooltip: "Copy unsuccessful...",
                success: false,
            });
            this.resetTooltipLater();
        });
    }

    componentWillUnmount() {
        this.removeTimeout();
        this.clipboardBtn.destroy();
    }

    removeTimeout() {
        if (this._timerID !== undefined) {
            window.clearTimeout(this._timerID);
            this._timerID = undefined;
        }
    }

    resetTooltipLater() {
        this.removeTimeout();
        this._timerID = window.setTimeout(() => {
            this.setState({
                tooltip: null,
                success: null,
            });
        }, 3000);
    }

    render() {
        return (
            <div className={Styles.clipboard}>
                <div>Share URL</div>
                <div className={Styles.explanation}>Anyone visiting this URL will see this map view.</div>
                <div className={Styles.clipboardBody}>
                    {this.props.source}
                    <button className={classNames(`btn-copy-${this.props.id}`, Styles.copyBtn)} data-clipboard-target={`#${this.props.id}`}>
                        Copy
                    </button>
                </div>
                {this.state.tooltip && <div className={Styles.tooltipWrapper}>
                    <Icon glyph={this.state.success ? Icon.GLYPHS.selected : Icon.GLYPHS.close} />
                    <span className={Styles.tooltipText}>{this.state.tooltip}</span>
                </div>}
            </div>
        );
    }
}

AutoClipboard.propTypes = {
    id: PropTypes.string.isRequired,
    source: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
};