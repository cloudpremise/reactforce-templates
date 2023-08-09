/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// ### React
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

// ### classNames
import classNames from 'classnames';

import CellContext from '@salesforce/design-system-react/components/data-table/private/cell-context';
import TableContext from '@salesforce/design-system-react/components/data-table/private/table-context';
import useContextHelper from '@salesforce/design-system-react/components/data-table/private/context-helper';
import Checkbox from '@salesforce/design-system-react/components/checkbox';
import InteractiveElement from '@salesforce/design-system-react/components/data-table/interactive-element';

// ## Constants
import { DATA_TABLE_CELL } from '@salesforce/design-system-react/utilities/constants';
const InteractiveCheckbox = InteractiveElement(Checkbox);

/**
 * The default Cell renderer for the DataTable. Pass in any React component with the same `displayName` which takes the same props to provide custom rendering.
 */
const DataTableCell = (props) => {
	const tableContext = useContext(TableContext);
	const cellContext = useContext(CellContext);
	const { tabIndex, hasFocus, handleFocus, handleKeyDown } = useContextHelper(
		tableContext,
		cellContext,
		props.fixedLayout
	);
	const childText = React.isValidElement(props.children)
		? props.children.props.children
		: props.children;
	const contents = (
		<div
			className={classNames({
				'slds-truncate': props.fixedLayout,
			})}
			title={props.title || childText}
		>
			{props.children}
		</div>
	);

	const className = classNames(props.className, {
		'slds-has-focus': hasFocus,
        'slds-display-inline-contents slds-p-left_none': props.canSelectRows
	});
	const ref = (node) => {
		if (node && hasFocus) {
			node.focus();
		}
	};
	let cell = (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<td
			className={className}
			data-label={props.label}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}
			ref={ref}
			role={props.fixedLayout ? 'gridcell' : null}
			style={props.width ? { width: props.width } : null}
			tabIndex={tabIndex}
			headers={props.headerId}
		>
            {
                props.canSelectRows ?
                    <InteractiveCheckbox
                        assistiveText={{
                            label: `${props.label} ${
                                Number(props.index)
                            }`,
                        }}
                        aria-labelledby={`${props.id}-SelectRow-label ${props.tableId}-SLDSDataTableHead-column-group-header-row-select`}
                        checked={props.isSelected}
                        id={`${props.id}-SelectRow`}
                        labelId={`${props.id}-SelectRow-label`}
                        name={`SelectRow${props.index}`}
                        onChange={props.handleToggle}
                    />
                :
                null
            }
			{contents}
		</td>
	);

	if (props.primaryColumn) {
		cell = (
			<th
				className={className}
				ref={ref}
				data-label={props.label}
				role={props.fixedLayout ? 'gridcell' : null}
				tabIndex={tabIndex}
				style={props.width ? { width: props.width } : null}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
			>
                {
                    props.checkbox ?
                        props.checkbox
                    :
                    null
                }
				{contents}
			</th>
		);
	}

	return cell;
};

// ### Display Name
// Always use the canonical component name as the React display name.
DataTableCell.displayName = DATA_TABLE_CELL;

// ### Prop Types
DataTableCell.propTypes = {
	/**
	 * The contents of the cell. This can be simple text or DOM nodes. Equivalent to `props.item[props.property]`
	 */
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	/**
	 * Class names to be added to the cell.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Use this if you are creating an advanced table (selectable, sortable, or resizable rows)
	 */
	fixedLayout: PropTypes.bool,
	/**
	 * The item from the items which represents this row.
	 */
	item: PropTypes.object,
	/**
	 * The primary column for a row. This is almost always the first column.
	 */
	primaryColumn: PropTypes.bool,
	/**
	 * The property of this item to display.
	 */
	property: PropTypes.string,
	/**
	 * Shows on hover. Useful for truncated cells.
	 */
	title: PropTypes.string,
	/**
	 * Width of column. This is required for advanced/fixed layout tables. Please provide units. (`rems` are recommended)
	 */
	width: PropTypes.string,

    checkbox: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

export default DataTableCell;
