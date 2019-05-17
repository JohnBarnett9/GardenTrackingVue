import typetagfilter from './typetagfilter.js';
import reusabletable from './reusabletable.js';

export default {
	/*
	reusabletable is v-bind to a variable in the store.
	v-bind cannot be to a variable in seed.js because typetagfilter.js needs to update the variable.
	*/
	template: 
		`
			<div>

				<el-row :gutter="20">
					<el-col :span="6">
						<h4>Seed Search Filtering</h4>
						<typetagfilter></typetagfilter>
					</el-col>
					<el-col :span="6">
						Search Results
						<reusabletable v-bind="this.$store.state.allSeedTableData"></reusabletable>
					</el-col>
				</el-row>

				
			</div>
		`
	,
	mounted: function () {
		/*
		initialize tableHeaders
		initializes this.$store.state.allSeedTableData.tableHeaders
		*/
		this.$store.dispatch('setSeedTableHeaders');

		/*
		initialize tableRows
		initializes this.$store.state.allSeedTableData.tableRows
		*/
		var typePK = 0;
		var tagPKs = "";
        this.$store.dispatch('updateSeedSearchResults', {
            typePK:typePK,
            tagPKs:tagPKs
        });        
	},
	/*
	typetagfilter and reusabletable are used in the template, so must be declared as children
	*/
	components: {
		typetagfilter: typetagfilter,
		reusabletable: reusabletable
	}
}

