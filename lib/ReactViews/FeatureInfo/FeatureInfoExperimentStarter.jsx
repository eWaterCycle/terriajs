import React from 'react';

import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import uuid from 'uuid';
// import defined from 'terriajs-cesium/Source/Core/defined';
import FeatureDetection from 'terriajs-cesium/Source/Core/FeatureDetection';

import DataUri from '../../Core/DataUri';

import Styles from './feature-info-experiment-starter.scss';

const FeatureInfoExperimentStarter = createReactClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        catalogItem: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        viewState: PropTypes.object.isRequired,
        canUseDataUri: PropTypes.bool
    },

    getInitialState() {
        return {
            selectedModels: [],
            selectedForcings: [],
            selectedParameterSets: []
        };
    },

    getDefaultProps() {
        return {
            canUseDataUri: !(FeatureDetection.isInternetExplorer() || (/Edge/).exec(navigator.userAgent))
        };
    },

    getLinks() {
        return [
            {
                href: DataUri.make('json', JSON.stringify(this.props.data)),
                download: `${this.props.name}.json`,
                label: 'JSON'
            }
        ].filter(download => !!download.href);
    },

    startExperiment() {
        const data = this.props.data;

        const request =
        {
            "notebook": {
                "directory": uuid(),
                "filename": data.model.name + ".ipynb"
            },
            "setup": {
                "config": data.config,
                "datafiles": data.datafiles,
                "model": data.model,
                "plotting": data.plotting
            }
        };

        const urlPromise = fetch('https://hub.ewatercycle2-nlesc.surf-hosted.nl:8888/bmi', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'basic c3R1ZGVudDE6VXY2YWV4b3lvNEFo'
            },
            body: JSON.stringify(request)
        }).then(response => response.json());

        urlPromise.then((response) => {
            window.open(response.location, '_blank');
        }, (reason) => {
                console.error('bad request in experiment launcher: ' + reason);
            }
        );

    },

    render() {
        // const catalogItem = this.props.catalogItem;

        if (DataUri.checkCompatibility()) {
            return (
                <div className={'experiment-description'}>
                    <span className={'experiment-description-title'}>Experiment description</span>
                    {/* <Choose>
                        <When condition={defined(startDate)}>
                            <table className={'experiment-description-date-table'}>
                                <tbody>
                                    <tr><th>start date</th><th>end date</th><th>timesteps</th></tr>
                                    <tr><td>{startDate.toString()}</td><td>{endDate.toString()}</td><td>{timesteps}</td></tr>
                                </tbody>
                            </table>
                        </When>
                        <When condition={catalogItem.isNcWMS}>
                            <span className={'models-selector-header'}>Please select a model</span>
                        </When>
                    </Choose> */}

                    <button type='submit' title="Start Experiment" className={Styles.btn} onClick={this.startExperiment}>Start Experiment</button>
                </div>
            );
        } else {
            return null;
        }
    }
});

export default FeatureInfoExperimentStarter;
