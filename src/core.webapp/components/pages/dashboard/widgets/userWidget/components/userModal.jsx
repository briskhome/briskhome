import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import Modal from 'react-modal';
import Avatar from '../../../../../avatar';
import { Icon } from '../../../../../ui';
import Input from '../../../../../ui/input';
import Title from '../../../../../ui/title';
import Button from '../../../../../ui/button';
import Checkbox from '../../../../../ui/checkbox';

class UserModal extends React.Component<*, *, *> {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      password: '',
      type: '',
      username: '',
      contacts: [
        {
          value: '',
          type: '',
        },
      ],
    };
  }
  render() {
    const { isOpen, user, onToggle } = this.props;
    const { firstName, lastName, contacts } = this.state;
    console.log({ contacts: this.state });
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onToggle}
        closeTimeoutMS={250}
        contentLabel="UserModal"
        className={{
          base: 'briskhome-modal__content',
          afterOpen: 'briskhome-modal__content_open',
          beforeClose: 'briskhome-modal__content_close',
        }}
        overlayClassName={{
          base: 'briskhome-modal__overlay',
          afterOpen: 'briskhome-modal__overlay_open',
          beforeClose: 'briskhome-modal__overlay_close',
        }}
        portalClassName="briskhome-modal"
      >
        <div className="user-widget__modal-header">
          {/* <Avatar name={`${firstName} ${lastName}`} /> */}
          <Icon name="add-profiles" className="user-widget__modal-icon" />
          <Title medium className="user-widget__modal-title">
            Create a new user
          </Title>
        </div>
        <form className="user-widget__modal-form">
          <Input
            name="first-name"
            display="inline-block"
            placeholder="First name"
            className="user-widget__modal-input"
            onChange={({ target: { value } }) => {
              // this.resetErrors();
              this.setState({ firstName: value });
            }}
          />
          <Input
            name="last-name"
            display="inline-block"
            placeholder="Last name"
            className="user-widget__modal-input"
            onChange={({ target: { value } }) => {
              // this.resetErrors();
              this.setState({ lastName: value });
            }}
          />
          <Title small className="user-widget__modal-subtitle">
            Role and permissions
          </Title>
          <Checkbox checked={true} onChange={() => null}>
            Visitor
          </Checkbox>
          <Checkbox checked={false} onChange={() => null} disabled>
            Member
          </Checkbox>
          <Checkbox checked={false} onChange={() => null} disabled>
            Owner
          </Checkbox>
          <Title small className="user-widget__modal-subtitle">
            Contacts
          </Title>
          {contacts.map(contact => (
            <React.Fragment>
              <Input
                name="first-name"
                value={contact.value}
                display="inline-block"
                placeholder="Value"
                className="user-widget__modal-input"
                onChange={({ target: { value } }) => {
                  // this.resetErrors();
                  this.setState({ firstName: value });
                }}
              />
              <Input
                name="last-name"
                value={contact.type}
                display="inline-block"
                placeholder="Type"
                className="user-widget__modal-input"
                onChange={({ target: { value } }) => {
                  // this.resetErrors();
                  this.setState({ lastName: value });
                }}
              />
            </React.Fragment>
          ))}
          {!!contacts.length &&
            contacts.pop().value !== '' &&
            contacts.pop().type !== '' && (
              <a href="#" onClick={() => null}>
                Add another one ->
              </a>
            )}
          <div className="user-widget__modal-controls">
            <Button
              caps
              link=""
              large
              yellow
              loading={false}
              display="inline-block"
              onClick={() => null}
            >
              Continue
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
}

export default compose(connect(state => state, () => ({})))(UserModal);
