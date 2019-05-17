import store from './store.js';

export default {
	template: 
		`
			<div>
				<h1>Admin Component</h1>
				<h2>Drop Tables Create Tables</h2>
				<button type="button" @click="dropTablesCreateTables">Drop Tables Create Tables</button>
				
				<br>
				<br>
				<h2>Add Minimal Data</h2>
				<button type="button" @click="addMinimalData">Add Minimal Data</button>


				<div id="output">
					<h2>Output of Drop Tables Create Tables</h2>
					<table>
						<thead>
							<tr>
								<th>column1</th>

							</tr>
						</thead>
						<tbody>
							<tr v-for="row in dropTablesCreateTablesOutput"> 
								<td>{{ row.line }}</td>
							</tr>
						</tbody>
					</table>

					<h2>Output of Add Minimal Data</h2>
					<table>
						<thead>
							<tr>
								<th>column1</th>

							</tr>
						</thead>
						<tbody>
							<tr v-for="row in addMinimalDataOutput"> 
								<td>{{ row.line }}</td>
							</tr>
						</tbody>
					</table>								
				</div>
			</div>
		`
	,
	methods: {
		dropTablesCreateTables: function(){
			console.log("in AdminComponent in dropTablesCreateTables");
			//store.dispatch('dropTablesCreateTables');
			this.$store.dispatch('dropTablesCreateTables');
		},
		addMinimalData: function(){
			console.log("in AdminComponent in addMinimalData");
			this.$store.dispatch('addMinimalData');
		}		
	},
	computed: {
		dropTablesCreateTablesOutput() {
			return this.$store.state.dropTablesCreateTablesOutput
		},
		addMinimalDataOutput() {
			return this.$store.state.minimalDataOutput
		}		
	}
};