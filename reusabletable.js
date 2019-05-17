export default {
	template: 
		`
			<div>
				<table>
					<thead>
						<tr>
							<th v-for="currHeader in this.tableHeaders">{{currHeader.header}}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="currRow in this.tableRows">
							<td v-for="col in currRow">
								{{col}}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		`
	,
	props: {
		tableHeaders: Array,
		tableRows: Array
	},
	data: function() {
		return {
		};
	}
}