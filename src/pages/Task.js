import {Row, Col, Form, Button, Table, Dropdown, Container, Modal} from 'react-bootstrap';

import {useState, useEffect} from 'react';

import { useMediaQuery } from 'react-responsive';

import Icon from '@mdi/react';
import { mdiFormatListGroupPlus, mdiClipboardListOutline  } from '@mdi/js'
 
export default function Task () {

    const [description, setDescription] = useState('');
    const [increment, setIncrement] = useState('');
    const [weeks, setWeeks] = useState('');
    const [isEmpty, setIsEmpty] = useState(true);
    const [tasksDescription, setTasksDescription] = useState('');
    const [taskBreakdown, setTaskBreakdown] = useState([]);
    const [isTaskAvailable, setIsTaskAvailable] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const isSmallDevice = useMediaQuery({maxWidth: 768});
 
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    

    function createTask (e) {
        e.preventDefault();
        
        fetch(`${process.env.REACT_APP_API_URL}/task/createTask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                description: description,
                increment: increment,
                weeks: weeks
            })
        })
        .then(result => result.json())
        .then(data => {
            if(data._id){
                populateTaskTable(data._id)
            }
        })

        setDescription('');
        setIncrement('');
        setWeeks('');
        setShowModal(false)
    }

    function addTaskToDropdown(){
        fetch(`${process.env.REACT_APP_API_URL}/task/list`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
        .then(result => result.json())
        .then(data => {
            if(data !== 'No task created for this user.'){
                setIsTaskAvailable(true)
                setTasksDescription(data.reverse().map(fetchedTasks => {
                    return(
                        <Dropdown key={fetchedTasks._id}>
                            <Dropdown.Item onClick={() => populateTaskTable(fetchedTasks._id)}>{fetchedTasks.description}</Dropdown.Item>
                        </Dropdown>
                    )
                }))
                
            }
            else{
                setIsTaskAvailable(false)
            }
        })
    }

    function populateTaskTable (taskId){

        fetch(`${process.env.REACT_APP_API_URL}/task/${taskId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(result => result.json())
        .then(data => {
            if(data._id){
                setTaskBreakdown(data.user.map(mappedUser => {
                    console.log(mappedUser)
                    const userTaskList = mappedUser.userTasks.map( taskArr => (
                        <tr>
                            <td>{taskArr.week}</td>
                            <td>{data.description}</td>
                            <td>{taskArr.expectedAmount}</td>
                            <td>{taskArr.totalAmount}</td>
                        </tr>
                    ))
                    
                    return userTaskList;
                }))
            }
        })
    }

    useEffect(() => {
        addTaskToDropdown();
    })

    useEffect(() => {
        if(description === '' || increment === '' || weeks === ''){
            setIsEmpty(true);
        }
        else{
            setIsEmpty(false);
        }
    }, [description, increment, weeks])

    

    return(
        <>
        {isSmallDevice?
        <>
        <Container className='mt-5'>
            
        <Row className='d-flex justify-content-center align-items-center'>
            <Col>
                <div className='d-flex justify-content-center'>
                    <Icon  path={mdiFormatListGroupPlus} size={2} role="button" onClick={handleShow}/>
                </div>
            </Col>
            <Col className=''>
                {isTaskAvailable ?
                    <Dropdown className='d-flex justify-content-center'>
                        <Dropdown.Toggle className='bg-light text-dark border-0'>
                            <Icon className='' path={mdiClipboardListOutline} size={2} role="button"/></Dropdown.Toggle>
                        <Dropdown.Menu>
                            {tasksDescription}
                        </Dropdown.Menu>
                    </Dropdown>
                    :
                    <></>
                }
                
            </Col>
        </Row>
        <Row className='mt-5'>
            <Col md={5} className='d-flex justify-content-center align-items-center' >
                {isTaskAvailable?
                    <Table striped bordered hover className='flex-grow-0 text-center' style={{maxHeight: '100vh'}}>
                        <thead>
                            <tr style={{fontWeight: 'bold'}}>
                                <td>Week</td>
                                <td>Task</td>
                                <td>Amount</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {taskBreakdown}
                        </tbody>
                    </Table>
                    :
                    <h3 className='text-secondary mt-5 pt-5'>Task list is empty.</h3>
                }
            </Col>
        </Row>
       

       {/* Modal contains the Form for creating tasks. */}
        <Modal show={showModal} onHide={handleClose} backdrop="static" className='mt-5'>
            <Modal.Body>
            <Form className='mb-2' onSubmit={e => createTask(e)}>
                    <Form.Group controlId='description'>
                        <Form.Label>Task Name:</Form.Label>
                        <Form.Control 
                            type='text'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId='increment'>
                        <Form.Label>Increment:</Form.Label>
                        <Form.Control 
                            type='number'
                            value={increment}
                            onChange={e => setIncrement(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId='weeks'>
                        <Form.Label>How many weeks?</Form.Label>
                        <Form.Control 
                            type='number'
                            placeholder='Enter number from 1-52'
                            value={weeks}
                            onChange={e => setWeeks(e.target.value)}
                            min="1"
                            max="52"
                            required
                        />
                    </Form.Group>
                    {isEmpty?
                    <>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <Button className='mt-3 bg-secondary border-0' onClick={handleClose}>Cancel</Button>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                                <Button className='mt-3' disabled>Create</Button>
                            </Col>
                        </Row>
                    </>
                    :
                    <>
                        <Row >
                            <Col className='d-flex justify-content-center'>
                                <Button className='mt-3 bg-secondary  border-0' onClick={handleClose}>Cancel</Button>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                                <Button type='submit' className='mt-3' >Create</Button>
                            </Col>
                        </Row>
                    </>
                    }
                </Form>
            </Modal.Body>
        </Modal>


       </Container>
       </>
       :
       <div className='text-center mt-5 pt-5'>
            <h1>Currently not supported.</h1>
        </div>
        }
       
       </>

    )

}