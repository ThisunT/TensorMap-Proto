import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Circles from "./NeuronSVG";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ParameterPanel from "./ParameterPanel";
import loadingIcon from "../assets/loading-icon.svg";

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    appBar: {
        position: 'relative',
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: '70%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    cardHeader: {
        backgroundColor: theme.palette.grey[200],
    },
    hiddenLayerBar: {
        flex: 1,
        position: 'relative',
    },
    fab: {
        margin: theme.spacing.unit,
    },
    title: {
        fontSize: 12
    }
});

function layerOfNuerons(layer, neurons) {
    this.layer = layer;
    this.neurons = neurons
}

const initialState = {
    hiddenLayers: 0,
    layersOfNeurons : [],
    bit: false,
    dataset: null,
    testAccuracy: null,
    processing: false
};

class NeuralNetwork extends React.Component {

    constructor(props){
        super(props);

        this.state = { ...initialState };
    }

    addHiddenLayer = () => {
        this.state.layersOfNeurons.push(new layerOfNuerons(this.state.hiddenLayers, 1));
        this.setState({
            hiddenLayers: this.state.hiddenLayers + 1
        })
    };

    removeHiddenLayer = () => {
        this.state.layersOfNeurons.pop();
        this.setState({
            hiddenLayers: this.state.hiddenLayers - 1
        })
    };

    addNeuron = (event, layer) => {
        let newLayersOfNeurons = this.state.layersOfNeurons.slice();
        newLayersOfNeurons[layer].neurons = this.state.layersOfNeurons[layer].neurons + 1;
        this.setState({
            layersOfNeurons: newLayersOfNeurons
        })
    };

    removeNeuron = (event, layer) => {
        let newLayersOfNeurons = this.state.layersOfNeurons.slice();
        newLayersOfNeurons[layer].neurons = this.state.layersOfNeurons[layer].neurons - 1;
        this.setState({
            layersOfNeurons: newLayersOfNeurons
        })
    };

    handleInput = name => event => {
        this.setState({ [name]: event.target.value });

        if(event.target.value === "MNIST"){
            this.setState({
                hiddenLayers: 1,
                layersOfNeurons : [new layerOfNuerons(0, 10)]
            })
        }
        else {
            this.setState(() => ({ ...initialState }));
        }
    };

    updateTestAccuracy(data){
        this.setState({
            testAccuracy: data
        })
    }

    updateProcessingState(bool){
        this.setState({
            processing: bool
        })
    }

    render(){
        console.log(this.state);
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="static" color="default" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                            TensorMap ProTo
                        </Typography>
                        <Button color="primary" variant="outlined">
                            Export
                        </Button>
                    </Toolbar>
                </AppBar>
                <main className={classes.layout}>
                    <div style={{margin: 'auto'}}>
                        <ParameterPanel dataset={this.state.dataset} updateTestAccuracy={this.updateTestAccuracy.bind(this)} updateProcessingState={this.updateProcessingState.bind(this)}/>
                    </div>
                    <Grid container spacing={40} alignItems="center" style={{marginTop: '0.5%'}}>
                        <Grid item key='Input' xs={2} >
                            <Card>
                                <CardHeader
                                    title='Input'
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div>
                                        <FormControl className={classes.formControl} style={{margin:'auto'}}>
                                            <InputLabel shrink htmlFor="activation-native-label-placeholder">
                                                Data Set
                                            </InputLabel>
                                            <NativeSelect
                                                value={this.state.activation}
                                                onChange={this.handleInput('dataset')}
                                                input={<Input name="activation" id="activation-native-label-placeholder" />}
                                            >
                                                <option value={null}>None</option>
                                                <option value={"MNIST"}>MNIST</option>
                                            </NativeSelect>
                                        </FormControl>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/*Hidden Layers*/}
                        <Grid item key='Deep Layers' xs={8} >
                            <div className={classes.hiddenLayerBar}>
                                <AppBar position="static" color="default" elevation={0}>
                                    <Toolbar>
                                        <Typography variant="h6" color="inherit" style={{marginLeft:'20%'}}>
                                            {this.state.hiddenLayers} Hidden Layers
                                        </Typography>
                                        <Fab color="default" aria-label="Add" size="small" className={classes.fab} disabled={this.state.hiddenLayers === 4 || this.state.dataset !== null}
                                             onClick={(event) => this.addHiddenLayer(event)}>
                                            <AddIcon/>
                                        </Fab>
                                        <Fab color="default" aria-label="Remove" size="small" className={classes.fab} disabled={this.state.hiddenLayers < 1 || this.state.dataset !== null}
                                             onClick={(event) => this.removeHiddenLayer(event)}>
                                            <RemoveIcon/>
                                        </Fab>
                                    </Toolbar>
                                </AppBar>
                            </div>
                            <Grid container spacing={40} alignItems="center" style={{marginTop: '0.5%'}}>
                                {this.state.layersOfNeurons.map(tier => (
                                    <Grid item key={tier.layer} xs={3} style={{margin:'auto'}}>
                                        <Card>
                                            <CardContent>
                                                <div>
                                                    <Typography component="p" variant="h6">
                                                        {this.state.layersOfNeurons[tier.layer].neurons + " Neurons"}
                                                    </Typography>
                                                    <Grid container spacing={10} alignItems="center">
                                                        <div style={{margin: 'auto'}}>
                                                            <Fab color="default" aria-label="Add" size="small" className={classes.fab} disabled={this.state.dataset !== null} onClick={(event) => this.addNeuron(event, tier.layer)}>
                                                                <AddIcon/>
                                                            </Fab>
                                                            <Fab color="default" aria-label="Remove" size="small" className={classes.fab} disabled={tier.neurons < 2 || this.state.dataset !== null} onClick={(event) => this.removeNeuron(event, tier.layer)}>
                                                                <RemoveIcon/>
                                                            </Fab>
                                                        </div>
                                                        {[...Array(tier.neurons).keys()].map(neuron => {
                                                            return(
                                                                <div style={{margin: 'auto'}}>
                                                                    <Circles height={100} width={100}/>
                                                                </div>
                                                            )
                                                        }) }
                                                    </Grid>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item key='Output' xs={2}>
                            <Card>
                                <CardHeader
                                    title='Test Accuracy'
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div style={{margin:'auto'}}>
                                        {this.state.testAccuracy === null && this.state.processing === false?
                                            <Typography component="h2" variant="h3" color="textPrimary">
                                                ^_-
                                            </Typography>
                                        :
                                            (this.state.processing === true ?
                                                <div >
                                                    <img src={loadingIcon} alt="logo" style={{margin:'auto'}}/>
                                                </div>
                                                :
                                                <Typography component="h2" variant="h3" color="textPrimary">
                                                    {this.state.testAccuracy}
                                                </Typography>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </main>
            </React.Fragment>
        );
    }
}

NeuralNetwork.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NeuralNetwork);