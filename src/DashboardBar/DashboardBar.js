import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { grey700 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconList from 'material-ui/svg-icons/action/list';
import ListViewModule from 'material-ui/svg-icons/action/view-module';

import isEmpty from 'd2-utilizr/lib/isEmpty';

import './DashboardBar.css';

import D2TextLink from '../widgets/D2TextLink';
import D2IconButton from '../widgets/D2IconButton';
import D2Dropdown from '../widgets/D2Dropdown';

import * as fromReducers from '../reducers';
import * as fromActions from '../actions';

const styles = {
    filterField: {
        fontSize: '14px',
        width: '200px',
    },
    filterFieldInput2: {
        top: '4px',
    },
    filterFieldHint2: {
        top: '10px',
    },
    filterFieldUnderline: {
        bottom: '11px',
    },
    filterFieldUnderlineFocus: {
        borderColor: '#aaa',
        borderWidth: '1px',
    },
    clearButton: {
        width: '24px',
        height: '24px',
        padding: 0,
        left: '-22px',
    },
    clearButtonIcon: {
        width: '16px',
        height: '16px',
    },
    toolbar: {
        height: 52,
        backgroundColor: '#fff',
        paddingTop: '10px',
        paddingBottom: '8px',
    },
    toolbarSeparator: {
        height: '26px',
        marginRight: '20px',
        marginLeft: '5px',
    },
    hiddenToolbarSeparator: {
        backgroundColor: 'transparent',
    },
};

// Component

class FilterField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: fromReducers.fromFilter.DEFAULT_NAME,
        };

        this.setFilterValue = this.setFilterValue.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.textFilter,
        });
    }

    setFilterValue(event) {
        event.preventDefault();

        this.props.onChangeTextFilter(event.target.value);
    }

    handleKeyUp(event) {
        const KEYCODE_ESCAPE = 27;

        if (event.keyCode === KEYCODE_ESCAPE) {
            this.props.onChangeTextFilter();
        }
    }

    render() {
        return (
            <TextField
                className="FilterField"
                value={this.state.value}
                onChange={this.setFilterValue}
                onKeyUp={this.handleKeyUp}
                hintText="Filter dashboards"
                style={styles.filterField}
                inputStyle={styles.filterFieldInput}
                hintStyle={styles.filterFieldHint}
                underlineStyle={styles.filterFieldUnderline}
                underlineFocusStyle={styles.filterFieldUnderlineFocus}
            />
        );
    }
}

FilterField.propTypes = {
    textFilter: PropTypes.string,
    onChangeTextFilter: PropTypes.func,
};

FilterField.defaultProps = {
    textFilter: '',
    onChangeTextFilter: Function.prototype,
};

const ClearButton = ({ onChangeTextFilter, textFilter }) => {
    const disabled = isEmpty(textFilter);

    return (
        <IconButton
            style={Object.assign({}, styles.clearButton, {
                opacity: disabled ? 0 : 1,
            })}
            iconStyle={styles.clearButtonIcon}
            onClick={() => onChangeTextFilter()}
            disabled={disabled}
        >
            <IconClear color={grey700} />
        </IconButton>
    );
};

ClearButton.propTypes = {
    onChangeTextFilter: PropTypes.func.isRequired,
    textFilter: PropTypes.string.isRequired,
};

const getViewFilterIcon = viewFilter => {
    const list = 'LIST';
    const table = 'TABLE';
    const buttonColor = grey700;

    const buttonMap = {
        [list]: <IconList color={buttonColor} />,
        [table]: <ListViewModule color={buttonColor} />,
    };

    return buttonMap[viewFilter];
};

const onClickViewFilterWrapper = (viewFilter, onClickViewFilter) => {
    const list = 'LIST';
    const table = 'TABLE';

    const onClickViewFilterParamMap = {
        [list]: table,
        [table]: list,
    };

    return () => onClickViewFilter(onClickViewFilterParamMap[viewFilter]);
};

export const Dashboardbar = props => (
    <Toolbar style={styles.toolbar}>
        <ToolbarGroup
            style={{ position: 'relative', left: '-10px' }}
            firstChild
        >
            <D2IconButton />
            <ToolbarSeparator style={styles.toolbarSeparator} />
            <D2TextLink text="Home" onClick={props.onClickHome} />
            <ToolbarSeparator
                style={Object.assign(
                    {},
                    styles.toolbarSeparator,
                    styles.hiddenToolbarSeparator
                )}
            />
            <D2TextLink
                text="Manage dashboards"
                onClick={props.onClickManage}
            />
        </ToolbarGroup>
        <ToolbarGroup lastChild>
            <FilterField {...props} />
            <ClearButton {...props} />
            <D2Dropdown
                value={props.ownerFilter}
                onClick={props.onClickOwnerFilter}
                data={fromReducers.fromFilter.ownerData}
            />
            <D2Dropdown
                value={props.sortFilterId}
                onClick={props.onClickSortFilter}
                data={fromReducers.fromFilter.orderData}
            />
            /*<D2IconButton
                icon={getViewFilterIcon(props.viewFilter)}
                iconStyle={{ width: 24, height: 24 }}
                onClick={onClickViewFilterWrapper(
                    props.viewFilter,
                    props.onClickViewFilter
                )}
            />*/
        </ToolbarGroup>
    </Toolbar>
);

Dashboardbar.propTypes = {
    onClickHome: PropTypes.func,
    onClickManage: PropTypes.func,
    onClickOwnerFilter: PropTypes.func,
    onClickOrderFilter: PropTypes.func,
    //onClickViewFilter: PropTypes.func,
    ownerFilter: PropTypes.string,
    orderFilter: PropTypes.string,
};

Dashboardbar.defaultProps = {
    onClickHome: Function.prototype,
    onClickManage: Function.prototype,
    onClickOwnerFilter: Function.prototype,
    onClickOrderFilter: Function.prototype,
    //onClickViewFilter: Function.prototype,
    ownerFilter: null,
    orderFilter: null,
    //viewFilter: null,
};

// Container

const mapStateToProps = state => ({
    textFilter: fromReducers.fromFilter.sGetName(state),
    ownerFilter: fromReducers.fromFilter.sGetOwner(state),
    orderFilter: fromReducers.fromFilter.sGetOrder(state),
    //viewFilter: fromReducers.fromFilter.sGetStyle(state),
});

const mapDispatchToProps = dispatch => ({
    onChangeFilterName: value => dispatch(fromActions.acSetFilterName(value)),
    onClickFilterOwner: value => dispatch(fromActions.acSetFilterOwner(value)),
    onClickFilterOrder: value => dispatch(fromActions.acSetFilterOrder(value)),
    //onClickViewFilter: value => dispatch(fromActions.acSetDashboardsConfigViewFilter(value)),
    onClickHome: () => dispatch(fromActions.tSetPresetHome()),
    onClickManage: () => dispatch(fromActions.tSetPresetManage()),
});

const DashboardbarCt = connect(mapStateToProps, mapDispatchToProps)(
    Dashboardbar
);

export default DashboardbarCt;
