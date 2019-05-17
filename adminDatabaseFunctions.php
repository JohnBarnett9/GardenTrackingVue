<?php 

require_once('databaseConnection.php');

if($_POST['adminDatabaseCommand'] == '1'){
	//echo "in adminDatabaseFunctions 1";
	dropTablesCreateTables();
}
else if($_POST['adminDatabaseCommand'] === '2'){
	addMinimalData();
}
else{//$_POST['adminDatabaseCommand'] === '3'
	addRealisticData();
}

function dropTablesCreateTables(){
	$databaseConnection = new databaseConnection();
	$databaseConnection->setupDB();
	$databaseConnection->setupConnection();
	//echo "session db name " . $databaseConnection->nameOfDatabase . "<br>";

	/*
	$sql = "INSERT INTO temp VALUES (1,2,3,4)";
	echo $sql;
	$query = $databaseConnection->dbConnection->prepare($sql);
	$query->execute();	
	*/
	
	$contents = file_get_contents("dropTablesCreateTables.txt", "r");
	$explosion = explode(";", $contents); //removes ';', but whatever
	$rows = array();
	$index = 0;
	foreach($explosion as $item){
		$rows[$index] = array( "line" => $item);
		$index++;
	}
	//print_r($rows);
	$databaseConnection->dbConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, 0);
	$databaseConnection->dbConnection->exec($contents);	
	
	echo json_encode($rows);

}

function addMinimalData(){
	$databaseConnection = new databaseConnection();
	$databaseConnection->setupDB();
	$databaseConnection->setupConnection();
	$contents = file_get_contents("addMinimalData.txt", "r");
	$explosion = explode(";", $contents); //removes ';', but whatever
	$rows = array();
	$index = 0;
	foreach($explosion as $item){
		$rows[$index] = array("line" => $item);
		$index++;
	}
	$databaseConnection->dbConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, 0);
	$databaseConnection->dbConnection->exec($contents);	

	echo json_encode($rows);
}
