import React, { useState } from "react";
import FormBuilder from "@formio/react/lib/components/FormBuilder";
import "./index.scss";
import produce, { setAutoFreeze } from "immer";
import { Modal } from "react-bootstrap";
import { Formio } from "formiojs";

setAutoFreeze(false);

const CustomFormBuilder = () => {
  const [showModal, setShowModal] = useState(true);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [updateDisplay, setUpdateDisplay] = useState("wizard");
  const [updateTheme, setUpdateTheme] = useState("primary");
  const [updateFontSize, setUpdateFontSize] = useState("h6");
  const [updateHeader, setUpdateHeader] = useState("header");
  const [updateFooter, setUpdateFooter] = useState("footer");

  const [reqLogin, setReqLogin] = useState("false");

  const [schema, setSchema] = useState({
    display: "form",
    components: [
      {
        title: "Page 1",
        label: "Page 1",
        type: "panel",
        key: "page1",
        customClass: updateFontSize,
        theme: updateTheme
      }
    ]
  });

  const handleUpdate = (
    updateDisplay,
    updateTheme,
    updateFontSize,
    updateHeader,
    updateFooter
  ) => {
    setSchema(
      produce(draft => {
        draft.components.forEach(element => {
          element.theme = updateTheme;
          element.customClass = updateFontSize;

          element.components.forEach(x => {
            if (x.type === "content" && x.label === "HContent") {
              x.html = updateHeader;
            }
            if (x.type === "content" && x.label === "FContent") {
              x.html = updateFooter;
            }
          });
        });
        draft.display = updateDisplay;
      })
    );
    const panelSchema = Formio.Components.components.panel.schema;

    Formio.Components.components.panel.schema = (...extend) => {
      var schema = panelSchema(extend);
      schema.theme = updateTheme;
      schema.customClass = updateFontSize;
      schema.components[0] = {
        type: "content",
        html: `<p>${updateHeader}</p>`,
        label: "HContent"
      };
      schema.components[1] = {
        type: "fieldset",
        label: "Field Set"
      };
      schema.components[2] = {
        type: "content",
        html: `<p>${updateFooter}</p>`,
        label: "FContent"
      };

      return schema;
    };
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    handleClose();
    handleUpdate(
      updateDisplay,
      updateTheme,
      updateFontSize,
      updateHeader,
      updateFooter
    );

    console.log("theme:", updateDisplay, "display:", updateTheme);
    console.log("req-login", reqLogin);
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
      >
        <Modal.Header>
          <Modal.Title>General Form-Builder Settings</Modal.Title>
          <button
            type="button"
            className="btn-clos"
            aria-label="Close"
            onClick={handleClose}
          >
            x
          </button>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label className="d-inline-block">
                {" "}
                <strong>Theme colour: </strong>{" "}
              </label>
              <select
                className="form-select"
                onChange={e => setUpdateTheme(e.target.value)}
                value={updateTheme}
              >
                <option value="danger">Red</option>
                <option value="primary">Green</option>
                <option value="success">Blue</option>
                <option value="warning">Yellow</option>
                <option value="dark">Gray</option>
                <option value="tertiary">Teal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="d-inline-block">
                {" "}
                <strong>General Font Size: </strong>{" "}
              </label>
              <select
                className="form-select"
                onChange={e => setUpdateFontSize(e.target.value)}
                value={updateFontSize}
              >
                <option value="h1">Large</option>
                <option value="h3">Medium</option>
                <option value="h6">Small</option>
              </select>
            </div>

            <div className="form-group">
              <label className="d-inline-block">
                {" "}
                <strong>Form Display:</strong>{" "}
              </label>
              <select
                className="form-select"
                onChange={e => setUpdateDisplay(e.target.value)}
                value={updateDisplay}
              >
                <option value="form">Single-Page</option>
                <option value="wizard">Multi-Page</option>
              </select>
            </div>

            <div className="form-select">
              <label className="d-inline-block">
                {" "}
                <strong>Require Applicant Log-in:</strong>{" "}
              </label>
              <select
                className="form-select"
                onChange={e => setReqLogin(e.target.value)}
                value={reqLogin}
              >
                <option value="true">Yes </option>
                <option value="false">No </option>
              </select>
            </div>

            <div className="form-select">
              <label className="d-inline-block">
                {" "}
                <strong>Enter Header:</strong>{" "}
              </label>
              <br></br>
              <textarea
                type="text"
                className="form-control col-xs-12"
                onChange={e => setUpdateHeader(e.target.value)}
              />
            </div>

            <div className="form-select">
              <label className="d-inline-block">
                {" "}
                <strong>Enter Footer:</strong>{" "}
              </label>
              <br></br>
              <textarea
                type="text"
                className="form-control col-xs-12"
                onChange={e => setUpdateFooter(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success">
              {" "}
              Apply Settings{" "}
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <div>
        <button onClick={handleShow}> General Settings </button>
        <button onClick={() => alert("Back-end not configured.")}>
          {" "}
          SUBMIT FORM{" "}
        </button>
        <FormBuilder
          form={schema}
          onChange={schema => console.log(schema)}
          options={{
            noNewEdit: true,
            alwaysConfirmComponentRemoval: true,
            builder: {
              data: false,
              premium: false
            }
          }}
        />
      </div>
    </>
  );
};

export default CustomFormBuilder;
