export default {
    template:
        `
            <el-collapse 
            v-model="activeName" 
            accordion 
            @change="collapseChanged"
            >
                <el-collapse-item 
                v-for="currType in this.allTagsOfAllTypes" 
                :key="currType.type_id"
                :title="currType.type_name" 
                :name="currType.type_id"
                >
                    <el-checkbox 
                    :indeterminate="isIndeterminate" 
                    v-model="checkAll" 
                    @change="handleCheckAllChange"
                    >
                        Check all
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedTags" >
                        <div
                        v-for="tag in currType.tags"
                        >
                            <el-checkbox 
                            :label="tag.tag_name" 
                            :key="tag.tag_id" 
                            @change="handleCheckedTagsChange(currType, tag)"
                            >
                                {{tag.tag_name}}
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-collapse-item>
            </el-collapse>
        `
    ,
    data() {
        return {
            //variables of Element library
            activeName: '0', //0 means no Type is expanded on inital page load, 1 means 1st Type is expanded on initial page load
            checkAll: false, //false is no symbol is in Check all checkbox, true is checkmark is in Check all checkbox
            isIndeterminate: false, //the - vs checkmark, when some but not all tags are checked

            //data from axios
            allTagsOfAllTypes: [], //array of objects, each object is a type, each object has array of tags of that type

            //current selections
            currTypePK: 0, //primary key of current type
            currTypeName: '', //used in sorting, such as Bean
            currTypeObject: {}, //set and updated in collapseChanged(), used in computed allTagsOfCurrTypePKs to get list of all tag ids of all tags of current type
            checkedTags: [], //list of tag names of currently checked tags
            checkedTagsObjects: [] //computed uses this, each object is a tag object. Every checked tag is an object in this array.
        };
    }, //end data
    methods: {
        //called when Type is clicked, to expand or collapse
        collapseChanged(event) {                        
            if (event != '') { //if:new drawer is opened, else:Type that was expanded was closed
                //typeObject is array of 1 element, the element is the type object with primary key of the, type clicked by user
                let typeObject = this.allTagsOfAllTypes.filter((currTypeFromArray) => {
                //let typeObject = this.$store.state.allTagsOfAllTypes.filter((currTypeFromArray) => {                    
                    return currTypeFromArray.type_id == event
                });
                this.currTypeObject = typeObject[0];//update the current type object
                this.checkAll = false;//turn off Check all
                this.checkedTags = [];//have 0 checked tags
                this.currTypeName = typeObject[0].type_name; //update this.currTypeName with new type that was clicked
                this.isIndeterminate = false; //new drawer is opened, Check all has no symbol
                this.currTypePK = event; //update currTypePK
            } else { //when user collapses Type
                this.currTypeName = '';//reset clicked type to be empty, 
                this.checkedTags = [];//reset checkedTags to be empty
                this.currTypePK = 0;//update currTypePK
                this.currTypeObject = {};//update the current type object
            }
            this.outputTypeTagFilters(this.currTypePK, "");
            //console.log("this.currTypePK=" + this.currTypePK);//output type PK
        },
        //called when 'Check all' is clicked
        handleCheckAllChange(val) {
            if (val) {
                this.checkedTags = this.allTagsOfCurrType;//all tags of this type are checked
                this.checkedTagsObjects = this.currTypeObject.tags;//no tags of this type are checked
            } else {
                this.checkedTags = [];//checkedTagsObjects is all tag objects of current type
                this.checkedTagsObjects = [];//checkedTagsObjects has 0 elements
            }
            this.isIndeterminate = false;//regardless if val is true or false, Check all does not have '-'

            //output
            let tagPKs = "";//no checked tags means list of tag PKs is empty
            if (val) {
                //all tags checked
                tagPKs = this.allTagsOfCurrTypePKs;
            }
            this.outputTypeTagFilters(this.currTypePK, tagPKs);
        },
        /*
        Called when tag is clicked.
        param: currType is the object of the Type that was clicked, not just the type_name
        */
        handleCheckedTagsChange(currType, currTag) {
            //get the number of tags of the currently selected Type
            let typeObject = this.allTagsOfAllTypes.filter((currentType) => {
                return currentType.type_name == currType.type_name
            });

            let numCheckedTags = this.checkedTags.length; //number of currently checked tags of this type
            let numTagsThisType = typeObject[0].tags.length; //total number of tags for this type
            this.checkAll = numCheckedTags === numTagsThisType; //checkAll is true when all tags are checked
            this.isIndeterminate = numCheckedTags > 0 && numCheckedTags < numTagsThisType; //isIndeterminate is true when number of checked tags is not 0 and not all

            //output
            //console.log("currType=" + this.currTypePK);
            //console.log("PKs=" + this.checkedTagPKs());
            this.outputTypeTagFilters(this.currTypePK, this.checkedTagPKs());
        },
        //translate checkedTags array of names into string of primary keys Ex:'1,17'
        checkedTagPKs() {
            let arrayOfPKs = []; //becomes array of checked tag PKs
            for (let i = 0; i < this.checkedTags.length; i++) {
                //find type object with the name of the current checkedTag index
                let matchingObj = this.currTypeObject.tags.filter((currentTagObj) => {
                    return currentTagObj.tag_name == this.checkedTags[i];
                });
                arrayOfPKs.push(matchingObj[0].tag_id);//add PK to array
            }
            //convert array to string
            return arrayOfPKs.join(','); //return string of PKs separated by ','
        },
        //funnel all filter changes through this method,
        //this method calls axios
        outputTypeTagFilters(typePK, tagPKs) {
            console.log("in outputTypeTagFilters");
            console.log("typePK=");
            console.dir(typePK);
            console.log("tagPKs=");
            console.dir(tagPKs);

            /*
            //case 1:no drawer is expanded
            //this does not incude initial page load
            //typePK is 0, tagPKs is ""
            if ((typePK === 0) && (tagPKs === "")) {
                console.log("in case 1");
            }
            //case 2:a drawer is expanded
            //typePK is not 0, tagPKs is ""
            else if ((typePK !== 0) && (tagPKs == "")) {
                console.log("in case 2");
            }
            //case 3:a drawer is expanded and one or more tags have been checked
            //typePK is not 0, tagPKs is not ""
            else if ((typePK != 0) && (tagPKs != "")) {
                console.log("in case 3");
            }
            */
            /*
            //update Search Results
            this.$store.dispatch({
                type:'updateSeedSearchResults',
                payload: {
                    typePK:typePK,
                    tagPKs:tagPKs
                }
            });
            */
            this.$store.dispatch('updateSeedSearchResults', {
                typePK:typePK,
                tagPKs:tagPKs
            });

        }        
    }, //end methods
    computed: {
        //when current type changes, update the tag names associated with that type
        //used when 'Check all' has checkmark
        allTagsOfCurrType() {
            let allTagNames;//array of tag names
            if (this.currTypeName != "") {
                //find the type object that has the current type that was clicked
                let typeObject = this.allTagsOfAllTypes.filter((currentType) => {
                    return currentType.type_name == this.currTypeName
                });

                //typeObject[0].tags; is array of all tag objects of the clicked type
                //map() extracts the tag_name from each tag object in tags, and pushes tag_name onto allTagNames
                allTagNames = typeObject[0].tags.map((currTagObj) => {
                    return currTagObj.tag_name;
                });
            } else {
                //handles 2 cases:
                //1, when page loaded or refreshed, before any type is clicked
                //2, when type drawer is closed
                allTagNames = [];
            }
            return allTagNames;
        },
        //return string of Primary Keys of all tags of current Type
        //used when Check all is checkmarked, need list of PKs
        allTagsOfCurrTypePKs() {
            let allTagPKs = this.currTypeObject.tags.map((currTag) => {
                return currTag.tag_id;
            });
            //return allTagPKs;
            let strPKs = allTagPKs.join(",");
            return strPKs;
        }
    },
    mounted: function(){
        //get all tags of all types
        axios.get('seedController.php', {
            params: {
                command:2
            }
        })
        .then((response) => {
            //console.log("in get command 2 response.data=");
            //console.dir(response.data);
            this.allTagsOfAllTypes = response.data;
        })
        .catch((error) => {
            console.log("errors of setTypeList action=");
            console.log(error);
        });
    }
}