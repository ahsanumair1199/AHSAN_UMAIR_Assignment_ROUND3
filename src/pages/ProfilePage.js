import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  ListGroup,
  Navbar,
} from "react-bootstrap";

const ProfilePage = () => {
  const [file, setFile] = useState();
  const [show, setShow] = useState(false);
  const [data1, setData] = useState([]);
  const navigate = useNavigate();
  const { user, logout, authTokens } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  let getUserData = async () => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/users/${user.user_id}/`
    );
    let response_data = await response.json();
    if (response.status === 200) {
      setUserData(response_data);
    }
  };
  const handleFile = (e) => {
    e.preventDefault();
    const fileToUpload = e.target.files[0];
    setFile(fileToUpload);
  };
  const handleSubmitData = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://127.0.0.1:8000/api/csvfile/", formData)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
    setShow(true);
  };
  useEffect(() => {
    {
      !user && navigate("/");
      getUserData();
      !userData && navigate("/");
    }
  }, [user]);
  return (
    <Container>
      <Navbar collapseOnSelect="true">
        <Navbar.Brand>
          <Link to="/" className="btn btn-primary" onClick={logout}>
            Logout
          </Link>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>Signed in as: {userData.first_name}</Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Row>
        <Col sm="12" md="6" lg="4" xl="4">
          <h1>User Details</h1>
          <ListGroup>
            <ListGroup.Item>
              <Row>
                <Col>Your Email:</Col>
                <Col>{userData.email}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Phone Number:</Col>
                <Col>{userData.phone}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Address:</Col>
                <Col>{userData.address}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm="12" md="6" lg="8" xl="8">
          <Form onSubmit={handleSubmitData}>
            <Form.Group className="mb-3">
              <Form.Label>Uplaod CSV file</Form.Label>
              <Form.Control
                type="file"
                name="document"
                encType="multipart/form-data"
                accept=".csv"
                onChange={handleFile}
              />
            </Form.Group>
            <Button type="submit" className="btn-success">
              Upload
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <h1 className="text-center">Your CSV Data</h1>
          {data1 &&
            data1.map((row) => {
              const row_list = row.split(",");
              return (
                <React.Fragment>
                  <Row
                    className=""
                    style={{
                      border: "1px solid grey",
                      borderRight: "1px solid grey",
                    }}
                  >
                    <Col md="2" style={{ borderRight: "1px solid grey" }}>
                      <p>{row_list[0]}</p>
                    </Col>
                    <Col md="2" style={{ borderRight: "1px solid grey" }}>
                      <p>{row_list[1]}</p>
                    </Col>
                    <Col md="2" style={{ borderRight: "1px solid grey" }}>
                      <p>{row_list[2]}</p>
                    </Col>
                    <Col md="2" style={{ borderRight: "1px solid grey" }}>
                      <p>{row_list[8]}</p>
                    </Col>
                    <Col md="2" style={{ borderRight: "1px solid grey" }}>
                      <p>{row_list[9]}</p>
                    </Col>
                    <Col md="2">
                      <p>{row_list[10]}</p>
                    </Col>
                  </Row>
                </React.Fragment>
              );
            })}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
