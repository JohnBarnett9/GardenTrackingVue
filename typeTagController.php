<?php 

require_once('databaseConnection.php');

class typeTagController {
	public $typeTagViewThing;
	public $typeModelThing;
	public $tagModelThing;
	public $databaseConnection;

	public function __construct(){
		$this->databaseConnection = new databaseConnection();
		$this->databaseConnection->setupDB();
		$this->databaseConnection->setupConnection();

		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			//echo "in if isset GET";
			if($_GET['command'] === '1'){
				$this->listAllTypes();
			} else if ($_GET['command'] === '5') {
				$this->listAllTags();
			} else if ($_GET['command'] === '6') {
				$this->listTagsOfThisType();
			} else if ($_GET['command'] === '7') {
				//echo "<br>in command 7<br>";
				$this->whichTagsDoesThisTypeNotHave();
			}
		}

		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			//echo "in if isset POST";
			//var_dump($_POST['paramsToSend']);
			
			if ($_POST['command'] === '2') {
				$this->editTypeName();
			} else if ($_POST['command'] === '3') {
				//echo "in command 3";
				$this->addType();
			} else if ($_POST['command'] === '4') {
				$this->deleteType();
			} else if ($_POST['command'] === '8') {
				$this->deleteTagFromType();
			} else if ($_POST['command'] === '9') {
				$this->addTagToType();
			} else if ($_POST['command'] === '10') {
				$this->editTagName();
			} else if ($_POST['command'] === '11') {
				$this->deleteTag();
			}
			
		}
		
	}
	
	//command 1
	public function listAllTypes()
	{
		$sql = 
			"SELECT * 
			FROM type
			ORDER BY type_name='000' DESC, type.type_name ASC;";

		$stmt = $this->databaseConnection->dbConnection->query($sql);
		$rows = array();
		$index = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$rows[$index] = array(
				"type_id" => $row['type_id'], 
				"type_name" => $row['type_name']
			);
			$index++;
		}
		echo json_encode($rows);
		
	}

	//command 2
	public function editTypeName()
	{
		$sql = "UPDATE `type` SET `type_name`= :newName WHERE `type`.`type_id` = :typeId";
		$query = $this->databaseConnection->dbConnection->prepare($sql);
		$query->bindParam(':newName', $_POST['newName']);
		$query->bindParam(':typeId', $_POST['typeId']);
		$query->execute();

	}

	//command 3
	public function addType()
	{
		$sql = 
		"INSERT INTO `type`(`type_id`, `type_name`) VALUES (DEFAULT, :newType)";
		$query = $this->databaseConnection->dbConnection->prepare($sql);
		$query->bindParam(':newType', $_POST['newType']);
		$query->execute();

	}

	//command 4
	public function deleteType()
	{
		//$sql = "DELETE FROM `type` WHERE `type_id` = :typeId";
		//if user deletes type, type name becomes 000
		$sql = "UPDATE `type` SET `type_name`= '000' WHERE `type_id` = :typeId";
		$query = $this->databaseConnection->dbConnection->prepare($sql);
		$query->bindParam(':typeId', $_POST['deleteTypeId']);
		$query->execute();
	}

	//command 5
	public function listAllTags()
	{
		$sql = "SELECT * FROM `tag` ORDER BY `tag_name` = '000' DESC, `tag`.`tag_name` ASC";
		$stmt = $this->databaseConnection->dbConnection->query($sql);
		$rows = array();
		$index = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$rows[$index] = array("column1" => $row['tag_id'], "column2" => $row['tag_name']);
			$index++;
		}
		echo json_encode($rows);

	}

	//command 6
	public function listTagsOfThisType()
	{
		//$sql = "SELECT * FROM `typetag` WHERE `typetag`.`type_id` = :typeId";
		$sql = "SELECT * FROM `typetag` INNER JOIN `tag` ON `typetag`.`tag_id` = `tag`.`tag_id` WHERE `typetag`.`type_id` = :typeId";
		$query = $this->databaseConnection->dbConnection->prepare($sql);
		$query->bindParam(':typeId', $_GET['typeId']);
		$query->execute();

		$rows = array();
		$index = 0;
		while($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$rows[$index] = array("column1" => $row['type_id'], "column2" => $row['tag_id'], "tag_name" => $row['tag_name']);
			$index++;
		}
		echo json_encode($rows);
	}

	//command 7
	public function whichTagsDoesThisTypeNotHave(){
		//echo "<br>in whichTagsDoesThisTypeNotHave()<br>";
		$sql = 
			"SELECT *
			FROM tag
			WHERE tag.tag_name
			NOT IN 
			(
				SELECT tag.tag_name
				FROM type
				INNER JOIN typetag on type.type_id = typetag.type_id
				INNER JOIN tag on typetag.tag_id = tag.tag_id
				WHERE type.type_id = :typeID
			)
			ORDER BY tag.tag_name";
		$query1 = $this->databaseConnection->dbConnection->prepare($sql);
		$query1->bindParam(':typeID', $_GET['typeId']);
		$query1->execute();


		$rows = array();
		$index = 0;
		while($row = $query1->fetch(PDO::FETCH_ASSOC)) {
			$rows[$index] = array(
				"tag_id" => $row['tag_id'], 
				"tag_name" => $row['tag_name']
			);
			$index++;
		}
		echo json_encode($rows);


	}

	//command 8
	public function deleteTagFromType(){
		echo "in deleteTagFromType() php";
		$typePK = $_POST['typePK'];
		$tagPK = $_POST['tagPK'];
		$sql = 
		"DELETE FROM `typetag` 
		WHERE `typetag`.`type_id` = $typePK AND `typetag`.`tag_id` = $tagPK";
		$query = $this->databaseConnection->dbConnection->prepare($sql);
		$query->execute();	
	}

	//command 9
	public function addTagToType(){
		echo "<br>in addTagToType()<br>";
		$typePK = $_POST['typePK'];
		$tagPK = $_POST['tagPK'];
		$sql = 
		"INSERT INTO `typetag`(`type_id`, `tag_id`) VALUES ($typePK, $tagPK);";
		$query = $this->databaseConnection->dbConnection->prepare($sql);
		$query->execute();

	}

	//command 10
	public function editTagName(){
		$sql = 
		"UPDATE `tag` 
		SET `tag_name`= :tagName
		WHERE `tag`.`tag_id` = :tagId";
		$query = $this->databaseConnection->dbConnection->prepare($sql);
		$query->bindParam(':tagName', $_POST['tagName']);
		$query->bindParam(':tagId', $_POST['tagId']);
		$query->execute();
	}

	//command 11
	public function deleteTag(){
		//must delete tag from seedtag table
		//and typetag table,
		//before I can delete tag from tag table
		
		//delete tag from seedtag table
		$tagId = $_POST['tagId'];
		$sql1 = 
		"DELETE FROM 
		seedtag 
		WHERE seedtag.tag_id= :tagId;";
		$query1 = $this->databaseConnection->dbConnection->prepare($sql1);
		$query1->bindParam(':tagId', $tagId);
		$query1->execute();
		
		//delete tag from typetag table
		$sql2 = 
		"DELETE FROM 
		typetag
		WHERE typetag.tag_id= :tagId";
		$query2 = $this->databaseConnection->dbConnection->prepare($sql2);
		$query2->bindParam(':tagId', $tagId);
		$query2->execute();
		
		/*
		//delete tag from tag table
		$sql3 = 
		"DELETE FROM
		tag
		WHERE tag.tag_id= :tagId";
		*/
		$sql3 =
		"UPDATE `tag` SET `tag_name`='000' WHERE `tag`.`tag_id`= :tagId";
		$query3 = $this->databaseConnection->dbConnection->prepare($sql3);
		$query3->bindParam(':tagId', $tagId);
		$query3->execute();
	}
}

$ttController = new typeTagController();
?>