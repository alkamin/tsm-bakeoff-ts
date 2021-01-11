lazy val client = project
  .in(file("scala-js"))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    libraryDependencies ++= Seq(
      "com.softwaremill.sttp.client3" %%% "core" % "3.0.0-RC15",
      "com.softwaremill.sttp.client3" %%% "circe" % "3.0.0-RC15",
      "com.azavea.stac4s" %%% "core" % "0.0.21",
      "com.azavea.stac4s" %%% "client" % "0.0.21",
      "io.github.cquiroz" %%% "scala-java-time" % "2.0.0"
    )
  )
  .settings(
    scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.ESModule) }
  )
