import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import classnames from 'classnames';
import Logger from '../Logger';
import utils from '../utils';
import UserChip from './UserChip';

const logger = new Logger('Dialer');

export default class Dialer extends React.Component {
	constructor(props) {
		super(props);

		this.state =
		{
			uri: props.callme || '',
			message: ''
		};
	}

	render() {
		const state = this.state;
		const props = this.props;
		const settings = props.settings;

		return (
			<div>
				<div data-component='Dialer'>
					<div className='userchip-container'>
						<UserChip
							name={settings.display_name}
							uri={settings.uri || ''}
							status={props.status}
							fullWidth
						/>
					</div>

					<form
						className={classnames('uri-form', { hidden: props.busy && utils.isMobile() })}
						action=''
						onSubmit={this.handleSubmit.bind(this)}
					>
						<div className='uri-container'>
							<TextField
								hintText='SIP URI or username'
								fullWidth
								disabled={!this._canCall()}
								value={state.uri}
								onChange={this.handleUriChange.bind(this)}
							/>
						</div>

						<RaisedButton
							label='Call'
							primary
							disabled={!this._canCall() || !state.uri}
							onClick={this.handleClickCall.bind(this)}
						/>
					</form>
				</div>
				<If condition={props.busy}>
					<div data-component='Dialer'>
						<form
							className={classnames('uri-form', { hidden: props.busy && utils.isMobile() })}
							action=''
							onSubmit={this.handleSubmit.bind(this)}
						>
							<div className='uri-container'>
								<TextField
									hintText='Enter a message...'
									fullWidth
									disabled={false}
									value={state.message}
									onChange={this.handleMessageChange.bind(this)}
								/>
							</div>

							<RaisedButton
								label='Message'
								primary
								disabled={false}
								onClick={this.handleClickSendMessage.bind(this)}
							/>
						</form>
					</div>
				</If>
			</div>

		);
	}

	handleUriChange(event) {
		this.setState({ uri: event.target.value });
	}

	handleMessageChange(event) {
		this.setState({ message: event.target.value });
	}

	handleSubmit(event) {
		logger.debug('handleSubmit()');

		event.preventDefault();

		if (!this._canCall() || !this.state.uri)
			return;

		this._doCall();
	}

	handleClickCall() {
		logger.debug('handleClickCall()');

		this._doCall();
	}

	handleClickSendMessage() {
		logger.debug('handleClickSendMessage()');

		this._doSendMessage();
	}

	_doCall() {
		const uri = this.state.uri;

		logger.debug('_doCall() [uri:"%s"]', uri);

		this.setState({ uri: '' });
		this.props.onCall(uri);
	}

	_doSendMessage() {
		const message = this.state.message;

		logger.debug('_doSendMessage() [message:"%s"]', message);

		this.props.onSendMessage(message);
	}

	_canCall() {
		const props = this.props;

		return (
			!props.busy &&
			(props.status === 'connected' || props.status === 'registered')
		);
	}
}

Dialer.propTypes =
{
	settings: PropTypes.object.isRequired,
	status: PropTypes.string.isRequired,
	busy: PropTypes.bool.isRequired,
	callme: PropTypes.string,
	onCall: PropTypes.func.isRequired
};
