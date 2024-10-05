import { ReactElement } from 'react';
import Modal from 'react-bootstrap/Modal';

interface PopupProps
{
    show: boolean;
    onHide: () => void;
    title: string;
    body: string;
    children: ReactElement;
    customclass?: string;
}

const Popup:React.FC<PopupProps> = (props: PopupProps) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={props.customclass}>
        <Modal.Title id="contained-modal-title-vcenter" >
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={props.customclass}>
        <h6>{props.body}</h6>
        {props.children}
      </Modal.Body>
    </Modal>
  );
}

export default Popup;