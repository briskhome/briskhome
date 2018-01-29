import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import Modal from 'react-modal';
import Avatar from '../../../../../avatar';
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
    };
  }
  render() {
    const { isOpen, user, onToggle } = this.props;
    const { firstName, lastName } = this.state;
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
        <Avatar name={`${firstName} ${lastName}`} />
        <Title medium className="user-widget__modal-title">
          Create a new user
        </Title>
        <form className="user-widget__modal-form">
          <Input
            name="first-name"
            placeholder="First name"
            onChange={({ target: { value } }) => {
              // this.resetErrors();
              this.setState({ firstName: value });
            }}
          />
          <Input
            name="last-name"
            placeholder="Last name"
            onChange={({ target: { value } }) => {
              // this.resetErrors();
              this.setState({ lastName: value });
            }}
          />
          <Checkbox checked={true} onChange={() => null}>
            Visitor
          </Checkbox>
          <Checkbox checked={false} onChange={() => null} disabled>
            Member
          </Checkbox>
          <Checkbox checked={false} onChange={() => null} disabled>
            Owner
          </Checkbox>
          <hr className="user-widget__modal-hr" />
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
