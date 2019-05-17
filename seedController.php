<?php
require_once('databaseConnection.php');

class SeedController {

	public $databaseConnection;

	public function __construct(){
		$this->databaseConnection = new databaseConnection();
		$this->databaseConnection->setupDB();
		$this->databaseConnection->setupConnection();

		//echo "in constructor";
		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			if ($_GET['command'] === '1') {
				$this->listAllSeeds();
			} else if ($_GET['command'] === '2') {
				$this->allTagsOfAllTypes();
			} else if ($_GET['command'] === '3') {
				$this->listAllSeedsForType();
			} else if ($_GET['command'] === '4') {
				$this->allSeedHeaders();
			} else if ($_GET['command'] === '5') {
				$this->allSeedRows();
			}
		}

		if ($_SERVER['REQUEST_METHOD'] === 'POST') {			
		}

	}

	//command 1
	public function listAllSeeds()
	{
		$sql = 
		"SELECT * FROM seed";
		$stmt = $this->databaseConnection->dbConnection->query($sql);
		$rows = array();
		$index = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$rows[$index] = array(
				"seed_id" => $row['seed_id'],
				"type_id" => $row['type_id'],
				"name" => $row['name'],
				"year" => $row['year'],
				"origin" => $row['origin'],
				"days" => $row['days'],
				"quantity" => $row['quantity'],
				"note" => $row['note']
			);
			$index++;
		}
		//print_r($rows);
		echo json_encode($rows);
	}

	//command 2
	public function allTagsOfAllTypes()	{
		$sqlOuter = 
		"SELECT * 
		FROM `type`
		WHERE `type`.`type_name` != '000'";
		//$stmt = $connection->dbConnection->query($sqlOuter);
		$stmt = $this->databaseConnection->dbConnection->query($sqlOuter);

		//works, not hardcoded, does not use JSON_FORCE_OBJECT

		$rows = array();
		$index = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			//echo "type=" . $row['type_name'] . "<br>";
			$sqlInner = 
			"SELECT `type`.`type_id`, `type`.`type_name`, `tag`.`tag_id`, `tag`.`tag_name`
			FROM `type`
			LEFT JOIN `typetag` ON `type`.`type_id` = `typetag`.`type_id`
			LEFT JOIN `tag` ON `typetag`.`tag_id` = `tag`.`tag_id`
			WHERE `type`.`type_id` = ".$row['type_id'] ."";
			//echo $row['type_id'] . "<br>";
			
			$stmtInner = $this->databaseConnection->dbConnection->query($sqlInner);
			$rowsTags = array();
			$indexInner = 0;
			while($rowInner = $stmtInner->fetch(PDO::FETCH_ASSOC)){
				$rowsTags[$indexInner] = array(
					"tag_id" => $rowInner['tag_id'], "tag_name" => $rowInner['tag_name']
				);
				$indexInner++;
			}
			$rows[$index] = array("type_id" => $row['type_id'], "type_name" => $row['type_name'] ,"tags" => $rowsTags);
			$index++;
		}
		//print_r($rows);
		echo json_encode($rows);

	}

	//command 3
	public function listAllSeedsForType()
	{
		$typePK = $_GET['typePK'];
		$typePK = trim($typePK); //good practice to strip off whitespace

		$tagPKs = $_GET['tagPKs'];
		$tagPKs = trim($tagPKs); //good practice to strip off whitespace

		//array of Primary Keys of tags, in double quotes
		$arrayOfTagPKs = explode(",", $tagPKs);
		$numCheckedBoxes = count($arrayOfTagPKs);

		//needed because explode() on empty array returns array with 1 empty element
		$acutalNumTags = 0;

		//==1 because if 0 tags, explode has 1 element in array, so count is 1
		if ($numCheckedBoxes == 1) {
			if ($arrayOfTagPKs[0] == "") {
				//0 tags because 1 element in array is empty double quotes
				//already set above if(), so don't need to set it here
			} else {
				//1 tag if element in array is not empty double quotes
				$acutalNumTags = 1;
			}
		} else {
			$acutalNumTags = $numCheckedBoxes; //when explode() on array with elements, count() of array is accurate
		}

        $sql = "";
        //case 1:no drawer is expanded
        //this does not incude initial page load
        //typePK is 0, tagPKs is ""
        if ($typePK == 0) {
        	$sql = 
        	"
        	SELECT *, group_concat(tag.tag_name) AS tags
        	FROM `seed`
        	INNER JOIN type ON seed.type_id = type.type_id
        	INNER JOIN seedtag ON seed.seed_id = seedtag.seed_id
        	INNER JOIN tag ON seedtag.tag_id = tag.tag_id
        	GROUP BY type.type_name, seed.name, seed.year, seed.origin
        	";
        }

        //case 2:a drawer is expanded
        //typePK is not 0, tagPKs is ""        
        else if (($typePK != 0) && ($acutalNumTags == 0)) {
        	//$sql = "SELECT * FROM seed";
        	$sql = 
        	"
        	SELECT *, group_concat(tag.tag_name) AS tags
        	FROM `seed` 
        	INNER JOIN type ON seed.type_id = type.type_id
        	INNER JOIN seedtag ON seed.seed_id = seedtag.seed_id
        	INNER JOIN tag ON seedtag.tag_id = tag.tag_id
        	WHERE `seed`.`type_id` = $typePK
        	GROUP BY type.type_name, seed.name, seed.year, seed.origin
        	";
        }

        //case 3:a drawer is expanded and one or more tags have been checked
        //typePK is not 0, tagPKs is not ""
        else if (($typePK != 0) && ($acutalNumTags > 0)) {
			$sql = 
				"SELECT seed.seed_id, type.type_id, type.type_name, seed.name, seed.year, seed.origin, seed.days, seed.quantity, seed.note,  group_concat(tag.tag_name) AS tags
				FROM seed 
				INNER JOIN
				(
					SELECT seedtag.seed_id FROM seedtag
					WHERE seedtag.tag_id IN ($tagPKs)
					GROUP BY seedtag.seed_id
					HAVING COUNT(*) = $numCheckedBoxes
				) AS st
				ON seed.seed_id=st.seed_id
				INNER JOIN type ON seed.type_id = type.type_id
				INNER JOIN seedtag ON seed.seed_id = seedtag.seed_id
				INNER JOIN tag ON seedtag.tag_id = tag.tag_id
				GROUP BY type.type_name, seed.name, seed.year, seed.origin";
        }
        
		$stmt = $this->databaseConnection->dbConnection->query($sql);
		$rows = array();
		$index = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$rows[$index] = 
			array(
				"column1" => $row['seed_id'], 
				"column2" => $row['type_id'],
				"column3" => $row['name'],
				"column4" => $row['year'],
				"column5" => $row['origin'],
				"column6" => $row['days'],
				"column7" => $row['quantity'],
				"column8" => $row['note'],
				"column9" => $row['tags']
			);
			
			$index++;
		}
		//print_r($rows);
		echo json_encode($rows);
	}	

	//command 4
	public function allSeedHeaders()
	{
		$sql = "SHOW columns FROM seed";
		$stmt = $this->databaseConnection->dbConnection->query($sql);
		$rows = array();
		$index = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
			$rows[$index] = 
			array("header" => $row['Field']);
			$index++;
		}

		//'tags' column is generated from group_concat(),
		//need to add outside while()
		$rows[$index] = array("header" => "tags");
		
		echo json_encode($rows);
	}

	//command 5
	public function allSeedRows()
	{
		$sqlOuter = 
		//"SELECT * FROM `seed` LIMIT 2";
		"SELECT * FROM `seed`";
		$stmt = $this->databaseConnection->dbConnection->query($sqlOuter);

		//works, not hardcoded, does not use JSON_FORCE_OBJECT

		$rows = array();
		$index = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$rows[$index] = 
			array(
				"column1" => $row['seed_id'], 
				"column2" => $row['type_id'],
				"column3" => $row['name'],
				"column4" => $row['year'],
				"column5" => $row['origin'],
				"column6" => $row['days'],
				"column7" => $row['quantity'],
				"column8" => $row['note']
			);
			$index++;
		}
		//print_r($rows);
		echo json_encode($rows);		
	}

}

$seedController = new SeedController();

?>