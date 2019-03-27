import React from 'react';
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import axios from 'axios';
import LineChart from "./LineChart";

let initialGraphData = {
    label: "",
    data: ""
};


class ParameterPanel extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            epochs: 1000,
            activation: "softmax",
            learningRate: 0.3,
            expanded: false,
            graphData: initialGraphData,
            currentEpoch: 0
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    updateGraph = (epoch, accuracy) => {
        initialGraphData.label = epoch;
        initialGraphData.data = accuracy;

        this.setState({
            graphData: initialGraphData
        }, () => {
            this.setState({
                currentEpoch: epoch
            })
        })

    };

    clearTimeInterval = () => {
        return (this.state.epochs - 1 === this.state.currentEpoch)
    };


    handleProcess(event){

        let props = this.props;
        let state = this.state;
        let updateGraph = this.updateGraph;
        let clearTimeInterval = this.clearTimeInterval;

        props.updateProcessingState(true);

        const payload = {
            epochs: state.epochs,
            activation: state.activation,
            learningRate: state.learningRate,
        };

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        };

        axios.post('http://localhost:5000/process', payload, config)
            .then( (response) => {
                this.setState({expanded: true});
                var i = setInterval(function(){
                    axios.get('http://localhost:5000/process/'+response.data)
                        .then(res => {
                            props.updateTestAccuracy(res.data.testAccuracy);
                            props.updateProcessingState(false);
                            updateGraph(res.data.epoch, res.data.testAccuracy);
                        });

                    if(clearTimeInterval()) {
                        clearInterval(i);
                    }
                }, 500);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render(){
        const { classes } = this.props;

        return(
            <Grid container spacing={40} alignItems="center" style={{marginTop: '0.5%'}}>
                <Grid item key='Input' xs={12}>
                    <div className={classes.root}>
                        <ExpansionPanel expanded={this.state.expanded} style={{width:'100%'}} elevation={0}>
                            <ExpansionPanelSummary>
                                <FormControl className={classes.formControl} style={{margin:'auto'}}>
                                    <InputLabel shrink htmlFor="epochs-native-label-placeholder">
                                        Epochs
                                    </InputLabel>
                                    <NativeSelect
                                        value={this.state.age}
                                        onChange={this.handleChange('epochs')}
                                        input={<Input name="epochs" id="epochs-native-label-placeholder" />}
                                    >
                                        <option value={1000}>1000</option>
                                        <option value={500}>500</option>
                                        <option value={2000}>2000</option>
                                        <option value={3000}>3000</option>
                                    </NativeSelect>
                                </FormControl>

                                <FormControl className={classes.formControl} style={{margin:'auto'}}>
                                    <InputLabel shrink htmlFor="activation-native-label-placeholder">
                                        Activation
                                    </InputLabel>
                                    <NativeSelect
                                        value={this.state.activation}
                                        onChange={this.handleChange('activation')}
                                        input={<Input name="activation" id="activation-native-label-placeholder" />}
                                    >
                                        <option value={"softmax"}>Softmax</option>
                                        <option value={"relu"}>ReLu</option>
                                        <option value={"sigmoid"}>Sigmoid</option>
                                        <option value={"tanh"}>Tanh</option>
                                    </NativeSelect>
                                </FormControl>

                                <FormControl className={classes.formControl} style={{margin:'auto'}}>
                                    <InputLabel shrink htmlFor="learningRate-native-label-placeholder">
                                        Learning Rate
                                    </InputLabel>
                                    <NativeSelect
                                        value={this.state.learningRate}
                                        onChange={this.handleChange('learningRate')}
                                        input={<Input name="learningRate" id="learningRate-native-label-placeholder" />}
                                    >
                                        <option value={0.3}>0.3</option>
                                        <option value={0.01}>0.01</option>
                                        <option value={0.001}>0.001</option>
                                        <option value={1}>1</option>
                                    </NativeSelect>
                                </FormControl>
                                <Button size="medium" variant="contained" color="primary" disabled={this.props.dataset === null} onClick={(event) => this.handleProcess(event)}>Process</Button>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <LineChart graphData={this.state.graphData} />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                </Grid>
            </Grid>
        )
    }
    
}

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(ParameterPanel);