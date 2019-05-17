export default {
	/*
	order of Types is from SQL query, 
	ORDER BY type_name='000' DESC, type.type_name ASC;";

	need to have 'newType' not 'this.newType'
	*/
	template:
		`
			<div>
				<el-row :gutter="20">
					<el-col :span="8">
						<table>
							<thead>
								<tr>
									<th></th>
									<th>column1</th>
									<th>column2</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="row in rowsOfTypeTable">
									<td>
										<input v-model="checkedTypeId" v-bind:value="row.type_id" type="radio" name="typeName" @click="checkboxIsClicked(row.type_id, row.type_name)">
									</td>
									<td>{{ row.type_id }}</td>
									<td>{{ row.type_name }}</td>
								</tr>
							</tbody>
						</table>
						<button type="button" @click="deleteType">Delete Type</button>
						<br>
						<br>
						<label>Edit Type</label>
						<br>
						<input type="text" v-model="checkedTypeName"></input>
						<br>
						<button type="button" @click ="submitEditType">Submit Edit</button>
						<br>
						<br>
						<label>Add Type</label>
						<br>
						<input type="text" v-model="newType"></input>
						<br>
						<button @click="addType">Add Type</button>
					</el-col>
					<el-col :span="8">
						Type Tag
						<br>
						
						<br>
						<select v-model="selection">
							<option>Select A Type</option>
							<option v-for="row in rowsOfTypeTableNotDeleted">
								{{ row.column2 }}
							</option>
						</select>
						<br>
						<label>Assigned Tags For This Type</label>
						<table>
							<thead>
								<tr>
									<th></th>
									<th>type_id</th>
									<th>tag_name</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="row in rowsOfTagsOfType">
									<td>
										<input type="radio" name="tagOfThisType" @click="assignedTagRadioClicked(row.column2)">
									</td>
									<td>{{ row.column2 }}</td>
									<td>{{ row.tag_name }}</td>
								</tr>
							</tbody>
						</table>

						<br>
						<button type="button" @click="deleteTagFromType">Delete Tag From Type</button>
						<br>




						<label>Assign Another Tag To This Type</label>
						<table>
							<thead>
								<tr>
									<th></th>
									<th>tag_id</th>
									<th>tag_name</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="row in rowsOfTagsNotOfType">
									<td>
										<input type="radio" name="tagOfThisType" @click="assignTagRadioClicked(row.tag_id)">
									</td>
									<td>{{ row.tag_id }}</td>
									<td>{{ row.tag_name }}</td>
								</tr>
							</tbody>
						</table>



						<br>
						<button type="button" @click="addTagToType">Add Tag To Type</button>
					</el-col>
					<el-col :span="8">
						Tag
						<br>
						<table>
							<thead>
								<tr>
									<th></th>
									<th>column1</th>
									<th>column2</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="row in rowsOfTagTable">
									<td>
										<input v-model="checkedTagId" v-bind:value="row.column1" type="radio" name="tagName" @click="tagCheckboxIsClicked(row.column1, row.column2)">
									</td>
									<td>{{ row.column1 }}</td>
									<td>{{ row.column2 }}</td>
								</tr>
							</tbody>
						</table>
						<button type="button" @click="deleteTag">Delete Tag</button>
						<br>
						<br>
						<label type>Edit Tag</label>
						<br>
						<input type="text" v-model="checkedTagName"></input>
						<br>
						<button type="button" @click="submitEditTag">Submit Edit</button>
						<br>
						<br>
						<label>Add Type</label>
						<br>
						<input type="text"></input>
						<br>
						<button type="button">Add Tag</button>
					</el-col>
				</el-row>
			</div>

		`
	,
	mounted: function () {
        console.log("typetag.js: dispatch setTypeList");		
		this.$store.dispatch('setTypeList');
		this.$store.dispatch('setTagList');//on initial page load, display tags
	},
	
	data() {
		return {
			newType: '', //type that appears in Add Typetextbox
			checkedTypeName: '', //name of Type of checkbox checked
			checkedTypeId: 0, //PK of Type of id of checkbox checked
			selection: 'Select A Type', //middle column drop down menu selected
			tagPKToDeleteFromType: 0, //PK of tag selected in 'Assigned Tags for This type'
			tagPKToAddToType: 0, //PK of tag selected in 'Assign Another Tag To This Type'

			//right column Tag
			checkedTagName: '', //name of Tag radio button selected
			checkedTagId: 0 //PK of Tag radio button selected
		}
	},
	watch: {
		/*
		when user selects a different Type in the middle column,
		load the Tags associated with that Type
		load the Tags that are possible to be assigned to that type
		*/
		selection: function() {
			console.log("selection changed to=" + this.selection + "=");

			//only get PK of Type if selected Type is not 'Select A Type'
			if (this.selection !== 'Select A Type') {
				//find PK associated with the Type selected
				let selectedId = this.$store.state.typeList.filter((obj) => {
					return obj.column2 == this.selection;
				});
				let pkOfType = selectedId[0].column1;
				console.log("pkOfType=" + pkOfType);
				
				//load the assigned tags for this Type
				this.$store.dispatch({
					type:'assignedTagsForThisType',
					typeId:pkOfType
				});

				//may be a problem to have 2 dispatches in a row, but they
				//don't depend on each other
				this.$store.dispatch({
					type:'tagsNotAssignedToThisType',
					typeId:pkOfType
				});
				

			} else {
				console.log("Select A Type was selected");
				//make 'Assigned Tags For This Type' be empty
				this.$store.commit({
					type: 'setTagsOfType',
					param1:[]
				});

				//make 'Assign Another Tag To This Type' be empty
				this.$store.commit({
					type: 'setTagsNotOfType',
					param1:[]
				});

			}
		}
	},
	computed: {
		//left column
		rowsOfTypeTable() {
			return this.$store.state.typeList
		},
		//middle column dropdownlist, does not include '000'
		rowsOfTypeTableNotDeleted() {
			//filter out '000' from TypeList
			return this.$store.state.typeList.filter((currType) => {
				//currType is an object with column1 and column2,
				//I am only comparing column2
				return currType.column2 != '000'
			});
		},		
		rowsOfTagTable() {
			return this.$store.state.tagList
		},
		//tags assigned for this type, middle column
		rowsOfTagsOfType() {
			return this.$store.state.tagsOfType
		},
		rowsOfTagsNotOfType() {
			return this.$store.state.tagsNotOfType
		}
		/*
		,
		checkboxedType() {
			return this.checkboxedType
		}
		,
		checkboxedTypeId() {
			return this.checkboxedTypeId
		}
		*/
		
	},
	methods: {
		/*
		Type radio button selected
		if checkboxedType has a value and the value equals the checkbox that was just clicked,
		the checkbox has been unchecked
		further simplified, if checkboxedType same as typename,
		checkbox has been unchecked

		this.checkedTypeName = radio button that was selected
		*/
		checkboxIsClicked: function(typeId, typeName) {
			console.log("in checkboxIsClicked method");
			console.log("typeId=");
			console.dir(typeId);
			console.log("typeName=");
			console.dir(typeName);
			console.log("this.checkedTypeName=");
			console.dir(this.checkedTypeName);


			if (typeName === this.checkedTypeName) {
				console.log("clicked in if");
				this.checkedTypeId = 0;
				this.checkedTypeName = '';
			} else {
				console.log("clicked in else");				
				//I'm not supposed to modify state directly
				this.checkedTypeId = typeId;
				this.checkedTypeName = typeName;
			}
			console.log("after ifelse this.checkedTypeName=");
			console.dir(this.checkedTypeName);

		},
		//Tag radio button selected
		tagCheckboxIsClicked: function(tagId, tagName) {
			console.log("in tagCheckboxIsClicked method");

			if (tagName === this.checkedTagName) {
				console.log("clicked in if");
			} else {
				console.log("clicked in else");
				this.checkedTagId = tagId;
				this.checkedTagName = tagName;
			}
			console.log("this.checkedTagId=");
			console.dir(this.checkedTagId);
			console.log("this.checkedTagName=");
			console.dir(this.checkedTagName);

		},
		/*
		Before this function executes, this.checkedTypeName is the new value of the Type.

		*/
		submitEditType: function() {
			//veg id
			//new veg name
			//var newVegName = this.checkboxedType;
			console.log("in submitEditType");
			console.log("this.checkedTypeName=");
			console.dir(this.checkedTypeName);

			//do not allow submit edit when textfield is empty
			if (this.checkedTypeName !== '') {
				this.$store.dispatch({
					type: 'editTypeName',
					typeName: this.checkedTypeName,
					typeId: this.checkedTypeId
				});
				console.log("in method submitEditType before dispatch setTypeList");
				//this.$store.dispatch('setTypeList'); //reload list of Types
				this.checkedTypeName = ''; //empty the Edit Type text field				
			} else {
				alert("Edit Type Textfield cannot be empty.");
			}
			

		},
		addType: function() {
			console.log("in addType");
			console.log("newType=");
			console.dir(this.newType);
			this.$store.dispatch({
				type: 'addType', newType: this.newType
			});
			this.newType = ''//need 'this.'
		},
		deleteType: function() {
			console.log("in deleteType");
			console.log("checkedTypeName=");
			console.dir(this.checkedTypeName);
			//only ask for confirmation when a checkbox has been checked
			if (this.checkedTypeId !== '') {
				console.log("something was checkedboxed");
				//user cannot delete Type '000'
				if (this.checkedTypeName != "000") {
					//user confirms delete with popup window
					if (confirm("Are you sure you want to delete?")) {
						console.log("confirmed");
						this.$store.dispatch({
							type: 'deleteType',
							typeId: this.checkedTypeId
						});
						this.checkedTypeId = 0;
						this.checkedTypeName = '';
					} else {
						console.log("not confirmed");
					}				

				} else {
					alert("you can't delete 000 because it is already deleted");
				}
			} else {
				console.log("something was not checkboxed");
				//if nothing checked and user tries to delete, nothing happens
			}
			
			
		},
		//which radio button was selected in the middle section,
		//'Assigned Tags For This Type'
		assignedTagRadioClicked(tagId){
			console.log("in assignedTagRadioClicked");
			console.log("tagId=");
			console.dir(tagId);
			this.tagPKToDeleteFromType = tagId;

		},
		//handles event of the 'Delete Tag From Type' being clicked
		deleteTagFromType: function(event) {
			console.log("in deleteTagFromType");
			let tagPK = this.tagPKToDeleteFromType;

			//transform 'Bean' into Primary Key
			let foundTypeObj = this.$store.state.typeList.filter((currTypeObj) => {
				return this.selection == currTypeObj.column2
			});
			
			let typePK = foundTypeObj[0].column1;
			console.log("typePK=" + typePK + " tagPK=" + tagPK);

			//when user clicks 'Delete' and 0 radio buttons selected, do nothing
			//otherwise delete tag from type
			if (this.tagPKToDeleteFromType != 0) {
				this.$store.dispatch('deleteTagFromType', {
					typePK:typePK,
					tagPK:tagPK
				});
			}

		},
		//which radio button was selected in the middle section,
		//'Assign Another Tag To This Type'
		assignTagRadioClicked(tagId){
			console.log("in assignTagRadioClicked");
			console.log("tagId=");
			console.dir(tagId);
			this.tagPKToAddToType = tagId;
		}
		
		,
		//handles event of the 'Add Tag To Type' being clicked
		addTagToType: function(event){
			console.log("in addTagToType");
			let tagPK = this.tagPKToAddToType;

			//transform 'Bean' into Primary Key
			let foundTypeObj = this.$store.state.typeList.filter((currTypeObj) => {
				return this.selection == currTypeObj.column2
			});

			//filter() returns array, access 1st element. column1 is the PK
			let typePK = foundTypeObj[0].column1;
			console.log("typePK=" + typePK + " tagPK=" + tagPK);

			//when user clicks 'Delete' and 0 radio buttons selected, do nothing
			//otherwise delete tag from type
			/**/
			if (this.tagPKToAddToType != 0) {
				this.$store.dispatch('addTagToType', {
					typePK:typePK,
					tagPK:tagPK
				});
			}
			


		}
		,
		//handles 'Edit Tag' being clicked
		submitEditTag: function(event){
			console.log("in submitEditTag method");
			if (this.checkedTagName != '') {
				console.log("this.checkedTagName=");
				console.dir(this.checkedTagName);
				this.$store.dispatch({
					type: 'editTagName',
					tagName: this.checkedTagName,
					tagId: this.checkedTagId
				});
				this.checkedTagName = '';
			} else {
				alert("Edit Tag Textfield cannot be empty.");
			}
		}
		,
		/*
		handles 'Delete Tag' button clicked
		
		Makes 0 Tag radio buttons selected.
		*/
		deleteTag: function(event){
			console.log("in deleteTag method");


			if (this.checkedTagId != '') { //delete if Tag radio button selected
				if (confirm("Are you sure you want to delete?")) {
					this.$store.dispatch({
						type: 'deleteTag',
						tagId: this.checkedTagId
					});
					this.checkedTagId = 0; //after Tag is deleted, no Tag radio button is selected
					this.checkedTagName = ''; //Clears 'Edit Tag' text field.
				} else {
					console.log("You cancelled this deletion.");
				}
			} else {
				console.log("No tag selected, not deleting anything.");
			}
		}


	} //end methods
};