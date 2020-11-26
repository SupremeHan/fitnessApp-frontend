import React, { useState, useEffect } from 'react';
import { WorkoutService } from '../../../services';
import { Button, Fade, FormControl, Backdrop, Grid, Input, InputAdornment, InputLabel, makeStyles, MenuItem, Modal, Select, TextField, Typography, IconButton } from '@material-ui/core';
import ReactPlayer from 'react-player';
import benchmarkService from '../../../services/benchmark.service';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';


const useStyles = makeStyles((theme) => ({
    workout: {
        justifyContent: 'center',
        
    },
    workoutInfo: {
        flexDirection: 'column',
    },
    workoutWrapper: {
        marginTop: '10px',
        marginBottom: '20px'
    },
    workoutItem: {
        margin: '10px 0px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '22px'
        }
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            alignItems: 'flex-start'
        }
    },
    input: {
        width: '150px',
        marginRight: '30px'
    },
    button: {
        width: '100px',
        height: '30px',
        [theme.breakpoints.down('xs')]: {
            marginTop: '20px'
        }
    },
    type: {
        marginRight: '30px',
        width: '150px'
    },
    itemRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      display: 'flex',
      flexDirection: 'column'
    },
    btnOut: {
        position: 'fixed',
        bottom: '14px',
        right: '20px'
    },
    btnAdd: {
        marginTop: '10px',
        color: '#eb5e28'
    }
}));


const UserWorkout = () => {

    const [workout, setWorkout] = useState([]);
    const [duration, setDuration] = useState();
    const [filter , setFilter] = useState(false);
    const [training, setTraining] = useState([]);
    const [type, setType] = useState('');
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [time, setTime] = useState(0);
    const [name, setName] = useState('');

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };


    const getAllWorkouts = () => {
        WorkoutService.getAll()
            .then(res => {
                setWorkout(res.data);
            }).catch(err => {
                console.log(err)
            });          
    }

    useEffect(() => {
        getAllWorkouts()
    }, []);

    const handleTimeChange = event => {
        const vreme = event.target.value;
        console.log(vreme);
        setTime(vreme);
    }
    const handleNameChange = event => {
        const ime = event.target.value;
        console.log(ime)
        setName(ime);
    }

    const handleTimeSubmit = event => {
        event.preventDefault();
        const a = JSON.parse(localStorage.getItem('user'));
        const z = {
            userId: a.id,
            workoutId: workout.workoutId,
            timeCompleted: time,
            name: name
        }
        console.log(z)
        benchmarkService.addBenchmark(z)
            .then(res => (console.log(res)))
            .catch(err => (console.log(err)))
    }

    const handleChange = event => {
        const duracija = event.target.value;
        setDuration( duracija );
    }

    const handleTypeChange = event => {
        const tip = event.target.value;
        console.log(tip)
        setType(tip);
    }

    const handleSubmit = event => {
        event.preventDefault();
        const x ={
            duration : parseInt(duration),
            type: type
        }

        WorkoutService.search(x)
            .then(res => {
                setTraining(res.data)
                setFilter(true);
            })
            .catch(e => {console.log(e)})
    }

    const modal = () => {
        return(
            <Modal
               aria-labelledby="transition-modal-title"
               aria-describedby="transition-modal-description"
               className={classes.modal}
               open={open}
               onClose={handleClose}
               closeAfterTransition
               BackdropComponent={Backdrop}
               BackdropProps={{
                 timeout: 500,
               }}
             >
               <Fade in={open}>
                
                 <form onSubmit={handleTimeSubmit} className={classes.paper}>
                     <Typography variant="h3">When you finish workout add your score here</Typography>
                   
                    <TextField
                      label="Workout Name"
                      id="standard-start-adornment"
                      onChange={handleNameChange}
                    />
                    <TextField
                      label="Time Completed"
                      id="standard-start-adornment"
                      onChange={handleTimeChange}                
                    />
                    <Button 
                        type="submit" 
                        className={classes.btnAdd}
                        variant="contained"
                    >
                        Add score</Button>
                 </form>
               </Fade>
             </Modal>
        );
    }

    return (
        <div className={classes.root}>
           {modal()}
          <Grid container className={classes.workout}>
            <Grid container item md={6} xs={12} className={classes.workoutInfo}>
                
                <form onSubmit={handleSubmit} className={classes.form}>
                    <div>
                    <TextField
                      label="Duration"
                      id="standard-start-adornment"
                      onChange={handleChange}
                      className={classes.input}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Min</InputAdornment>,
                      }}
                    />
                  </div>
                    <div>
                    <FormControl className={classes.type}>
                      <InputLabel id="demo-simple-select-label">Type</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={handleTypeChange}
                        value={type}
                      >
                        <MenuItem value={'strenght'}>Strength</MenuItem>
                        <MenuItem value={'endurance'}>Endurance</MenuItem>
                        <MenuItem value={'power'}>Power</MenuItem>
                      </Select>
                    </FormControl>
                    </div>
                    <div>
                     <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        className={classes.button}
                    >Submit
                    </Button>
                    </div>
                </form>
                 <div className={classes.btnOut}>
                    <Button 
                        className={classes.btnIn} 
                        type="button" 
                        size="large"
                        color="secondary"
                        onClick={handleOpen}
                        endIcon={<FitnessCenterIcon/>}
                    >
                         Workout
                    </Button>
                 </div>
                       
                {filter == false ?
                <>
                 
                 {workout.map(item => (
                    <div className={classes.items}>
                        <hr/>
                        <Typography align="center" variant="h2" className={classes.workoutItem}><strong>{item.name}</strong></Typography>
                        <Typography align="center" variant="body1" className={classes.workoutItem}><strong>Training</strong><br/> {item.wod}</Typography>
                        <div className={classes.itemRow}>
                            <Typography variant="body1" className={classes.workoutItem}><strong>Duration</strong><br/> {item.duration}min</Typography>
                            <Typography variant="body1" className={classes.workoutItem}><strong>Type</strong><br/> {item.type}</Typography>
                        </div>
                        
                        <ReactPlayer
                            width="100%"
                            height="400px"
                            url={item.videoLink}
                        />

                    </div>
                    ))}
                </>
                 :
                 <>
                    {training.map(item => (
                        <div className={classes.items}>
                            <hr/>
                            <Typography align="center" variant="h2" className={classes.workoutItem}><strong>{item.name}</strong></Typography>
                            <Typography align="center" variant="body1" className={classes.workoutItem}><strong>Training</strong><br/> {item.wod}</Typography>
                            <div className={classes.itemRow}>
                                <Typography variant="body1" className={classes.workoutItem}><strong>Duration</strong><br/> {item.duration}min</Typography>
                                <Typography variant="body1" className={classes.workoutItem}><strong>Type</strong><br/> {item.type}</Typography>
                            </div>

                            <ReactPlayer
                                width="100%"
                                height="400px"
                                url={item.videoLink}
                            />
                        </div>
                    ))}
                     </>
                 }
               




               
            </Grid>
        </Grid>
        </div>
    );
}
export default UserWorkout;