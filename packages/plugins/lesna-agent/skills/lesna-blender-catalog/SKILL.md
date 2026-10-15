---
name: "lesna-blender-catalog"
description: "Catalogo literal del MCP de Blender: las 286 herramientas agrupadas por familias, cada una con lo que hace. Usala cuando trabajes en Blender, cuando dudes si algo se puede, o cuando necesites el nombre exacto de una herramienta (modelado, topologia, rig, pesos, animacion, fisica, materiales, render, IA 3D, assets externos)."
---

# Catálogo del MCP de Blender

Nombre literal de cada herramienta del MCP de Blender, con lo que hace. Fuente: el
propio servidor MCP (286 herramientas). Para cualquier agente Lesna: aquí está el
alcance real. Si dudas de si algo se puede, consúltalo.

## Escena e inspección

- `get_scene_info` — Get detailed information about the current Blender scene Parameters: - user_prompt: The original user prompt that led to this tool call (required for telemetry)
- `get_object_info` — Get detailed information about a specific object in the Blender scene. Parameters: - object_name: The name of the object to get information about - user_prompt: The original user prompt that led to this tool call (for telemetry)
- `bm_ping` — Instant health check. Returns scene name + frame.
- `bm_list` — Compact list of objects: name, type, world dims only. ~10x smaller than bm_dump_objects.
- `bm_list_actions` — List all actions: name, fake_user, frame_range.
- `bm_list_bones` — List all bones: name, parent, head_local, tail_local, length, use_connect.
- `bm_list_collections` — List all collections + their objects + children.
- `bm_list_modifiers` — List object's modifiers.
- `bm_list_workspaces` — List workspaces + current.
- `bm_dump_objects` — Dump ALL objects in one call: name, type, loc, rot, scale, parent, bbox local + world, vgroups, modifiers. Replaces multiple get_object_info calls. types: optional filter like ['MESH','ARMATURE'].
- `bm_find_objects` — Find objects by name fnmatch pattern (e.g. 'Gun_*', '*Arm*'). Optionally filter by type.
- `bm_find_by_property` — Filter objects by properties.
- `bm_find_closest_vertex` — Find index + distance + position of vertex closest to given world point.
- `bm_inspect_animation` — Animation introspection: pose bone rotation_mode + current rotation values, action name + fcurve count + slots/layers (Blender 4.x action API).
- `bm_inspect_modifier` — Detailed modifier dump — use_vertex_groups, use_bone_envelopes, object ref, levels, segments, etc. Set modifier_name=None for all modifiers on the object.
- `bm_read_console` — Token-friendly console reader (Blender stdout/stderr ring buffer). Args: lines: tail size, default 50 filter: substring grep stream: 'OUT' or 'ERR' to limit since: ISO timestamp; only newer entries clear: drop buffer after read max_line: per-line char cap (default 200, truncates with marker) max_chars: total payload cap (default 6000; trims oldest first) dedupe: collapse consecutive duplicate lines (default True) mode: 'compact' (O|line / E|line), 'entries' (objects), 'summary' (counts + last 5 errs) include_ts: prepend ISO timestamp in compact mode (default False)
- `bm_get_bbox` — Single object bbox + dims. space: world|local.
- `bm_get_transform` — Single object TRS (loc/rot_deg/scale/parent) — compact.
- `bm_get_vertex` — Get vertex position by index. space: world|local.
- `bm_get_evaluated_vertex` — Vertex position AFTER all modifiers + pose deform applied (depsgraph eval). Use to verify Armature modifier actually deforms the mesh. space: world|local.
- `bm_mesh_thickness_stats` — Measure wall thickness via raycasts. Returns min/max/avg — catches parts too thin.
- `bm_score_mesh_quality` — Comprehensive mesh quality score 0-100 + warnings + symmetry.
- `bm_compare_meshes` — Compare 2 meshes: vert/poly diff, dim diff, quality score diff.
- `bm_check_topology` — Report tris/quads/ngons/non-manifold/loose stats.
- `bm_check_symmetry` — Verify mesh is symmetric across axis. Returns matched/unmatched + symmetry %.
- `bm_warn_topology` — COMPREHENSIVE topology audit. Returns warnings + topology_score 0-100. Call after any mesh op to catch junk.
- `bm_pole_count` — Histogram of vert edge-degrees + warnings. Good topology = mostly 4-pole verts.
- `bm_identify_faces` — Classify mesh polygons by normal direction. Returns {TOP, BOTTOM, FRONT, BACK, LEFT, RIGHT, UNKNOWN: [face_indices]}. Convention (world space): +X=RIGHT, -X=LEFT, +Y=BACK, -Y=FRONT, +Z=TOP, -Z=BOTTOM. threshold: dot-product cutoff (0.7 ~ 45° tolerance). Faces too tilted go to UNKNOWN. assign_all: when True, sub-threshold faces still claim their best-matching side (no UNKNOWN).
- `bm_label_faces_by_side` — Apply per-side image-texture materials to faces. Reads <SIDE>.png from texture_dir. UVs span the side cluster as one image, aspect preserved, overflow filled by EXTEND. use_world: WORLD-space classification (True) vs OBJECT-LOCAL (False, default). Local respects rotation/tilt. mirror_lr / mirror_fb / mirror_tb: swap textures on opposing sides. Use mirror_lr=True on a body's right-side arm so its outer face shows R.

## Modelado de malla

- `bm_add_primitive` — Add primitive. type: CUBE|UV_SPHERE|ICO_SPHERE|CYLINDER|CONE|TORUS|PLANE|CIRCLE|MONKEY.
- `bm_extrude_along_normal` — Extrude specific faces along their normals by distance.
- `bm_bevel_edges` — Bevel edges. edge_indices=None => all edges.
- `bm_smart_bevel` — Bevel + auto-crease for SubSurf-friendly hard surface (HardOps-style).
- `bm_inset_faces` — Inset faces. Critical for adding edge loops around features without breaking topology.
- `bm_loop_cut` — Add loop cut(s) running through an edge.
- `bm_subdivide` — Subdivide entire mesh.
- `bm_boolean` — Boolean op between meshes. operation: DIFFERENCE|UNION|INTERSECT. solver: EXACT|FAST.
- `bm_bisect_plane` — Bisect mesh with plane. clear_inner removes side opposite normal.
- `bm_bridge_edge_loops` — Bridge two edge loops. edge_indices: list forming two loops, or None for current selection.
- `bm_fill_face` — Fill a polygon from given verts.
- `bm_grid_fill` — Grid-fill closed edge loop.
- `bm_planar_faces` — Flatten near-coplanar faces.
- `bm_edge_slide` — Slide edge loop along adjacent edges. factor: -1..1.
- `bm_edge_split` — Split edges by angle threshold (no edge_indices) or by explicit indices.
- `bm_triangulate` — Convert quads/ngons to triangles.
- `bm_quadrify` — Convert tris to quads.
- `bm_mirror_verts` — Mirror vertex subset across plane (axis='x'|'y'|'z') at plane_pos.
- `bm_merge_verts` — Merge verts. mode: CENTER|FIRST|LAST|COLLAPSE.
- `bm_remove_doubles` — Merge vertices within distance.
- `bm_perfect_box` — Create perfect axis-aligned box from exact mins/maxs (object-local). 8 verts, 6 faces, no fp noise.
- `bm_punch_pattern` — Punch repeated holes/slots through target (e.g. cooling slot pattern on MP40 receiver).
- `bm_make_orthogonal_corner` — Snap all edges touching a vert to nearest cardinal axis — produces perfect 90° corners.
- `bm_symmetrize` — Symmetrize mesh. direction: POSITIVE_X|NEGATIVE_X|POSITIVE_Y|NEGATIVE_Y|POSITIVE_Z|NEGATIVE_Z (or +X/-X shorthand).

## Topología y limpieza

- `bm_clean_topology` — One-shot cleanup: merge doubles + recalc normals + tris→quads + remove loose.
- `bm_decimate` — Reduce poly count. Beware: can introduce bad triangulation.
- `bm_decimate_planar` — Planar decimation — preserves curvature, collapses flat regions.
- `bm_decimate_unsubdivide` — Reverse subdivision.
- `bm_remesh` — Auto-remesh. mode: VOXEL (most reliable)|QUAD|SHARP|SMOOTH|BLOCKS.
- `bm_quadriflow_remesh` — QuadriFlow (built-in Blender) — best automatic quad remesher.
- `bm_optimize_for_polycount` — Smart polycount reduction. Tries QuadriFlow first, falls back to Decimate.
- `bm_remove_loose_geometry` — Delete unconnected verts/edges/faces.
- `bm_dissolve_limited` — Limited Dissolve — removes unnecessary geometry below angle threshold. Best topology cleanup tool.
- `bm_minimize_poles` — Iteratively dissolve high-poles (fan triangulation cleanup).
- `bm_recalc_normals` — Recalculate normals consistently. inside=True flips outward.
- `bm_flatten_verts` — Flatten filtered verts to a plane (set axis coord = value).
- `bm_smooth_verts` — Laplacian-smooth filtered verts. vert_filter same as rotate_verts.
- `bm_round_vert_positions` — Round vert coords to N decimals — kills floating-point noise.
- `bm_snap_to_grid` — Snap object loc to nearest grid_size step. snap_rotation also rounds rotation to 90°.
- `bm_mesh_separate` — Separate mesh. mode: LOOSE|SELECTED|MATERIAL. Returns new object names.
- `bm_separate_by_bbox` — Separate verts inside axis-aligned bbox into new object (e.g. door from car by spatial selection).
- `bm_separate_by_material` — Separate mesh into one object per material slot.
- `bm_separate_by_normal` — Separate faces with normal aligned to axis. axis: 'x','y','z','-x','-y','-z'.
- `bm_separate_by_vgroup` — Separate verts in a vertex group into a new object (e.g. mag from gun).
- `bm_equalize_edges` — Relax verts to make edge lengths more uniform.

## Modificadores

- `bm_add_modifier` — Add modifier. mod_type: SUBSURF|MIRROR|ARMATURE|SOLIDIFY|BEVEL|SMOOTH|DECIMATE|BOOLEAN|ARRAY|LATTICE|SHRINKWRAP. properties: dict like {'levels':2, 'object':'OtherObjName'} (object refs auto-resolved).
- `bm_apply_modifier` — Apply (bake) modifier into mesh data.
- `bm_apply_all_modifiers` — Apply all modifiers in stack order.
- `bm_add_subsurf` — Add Subdivision Surface modifier.
- `bm_add_solidify_modifier` — Solidify modifier — gives sheet thickness. offset: -1=inside, 0=center, 1=outside.
- `bm_add_wireframe_modifier` — Wireframe modifier — converts mesh to 3D wire.
- `bm_array_modifier` — Array modifier (non-destructive).
- `bm_curve_modifier` — Deform mesh along curve via Curve modifier. axis: POS_X|NEG_X|POS_Y|NEG_Y|POS_Z|NEG_Z.
- `bm_add_skin_modifier` — Skin modifier — turns edge graph into cylinders. Set root vert + default radius.
- `bm_add_armature_modifier` — Bind mesh to armature via Armature modifier + parenting.
- `bm_remove_modifier` — Remove modifier without applying.
- `bm_shrinkwrap_to` — Project mesh onto target via Shrinkwrap. Great for retopo on high-poly references.

## Curvas y texto

- `bm_create_curve` — Create curve from control points. type: BEZIER|NURBS|POLY.
- `bm_add_curve_primitive` — Add curve primitive. type: BEZIER_CIRCLE|BEZIER_CURVE|NURBS_CIRCLE|NURBS_PATH.
- `bm_curve_to_mesh` — Convert curve object to mesh.
- `bm_set_curve_bevel` — Add bevel to curve (thickness). bevel_object: name of cross-section curve.
- `bm_offset_curve` — Create parallel curve offset along axis.
- `bm_bezier_from_4pts` — Create cubic Bezier curve from 4 control points.
- `bm_circle_arc` — Create curve arc passing through 3 points (p2 is the mid-point hint).
- `bm_circle_from_3pts` — Center + radius of circle through 3 coplanar points.
- `bm_text_3d` — Create 3D text object. extrude = depth (thickness).
- `bm_emboss_text` — Emboss/engrave text into target via Boolean. operation: DIFFERENCE (engrave) | UNION (emboss).

## Materiales, color y texturas

- `bm_create_material` — Create Principled BSDF material. base_color=[r,g,b,a] 0-1.
- `bm_assign_material` — Assign material to object or specific faces.
- `set_texture` — Apply a previously downloaded Polyhaven texture to an object. Parameters: - object_name: Name of the object to apply the texture to - texture_id: ID of the Polyhaven texture to apply (must be downloaded first) Returns a message indicating success or failure.
- `bm_resize_texture` — Resize image in Blender. Optionally save to disk.
- `bm_color_faces` — Assign solid color material to specific face indices. color=[r,g,b,a] 0-1.
- `bm_color_faces_by_side` — Identify + color faces by side in one call. color_map: {'TOP': [r,g,b,a], 'FRONT': [r,g,b,a], ...} — only listed sides get colored. Great for orientation debugging — give each side a distinct color to track which way is which.
- `bm_keyframe_material_color` — Keyframe Principled BSDF base color. color: [r,g,b,a] 0-1.
- `bm_keyframe_material_emission` — Keyframe Principled BSDF emission strength (for light on/off animations).
- `bm_select_by_material` — Select all faces with given material assigned.

## UV y sombreado

- `bm_uv_unwrap` — UV unwrap. method: SMART|UNWRAP|CUBE|SPHERE|CYLINDER|PROJECT_FROM_VIEW.
- `bm_mark_seam` — Mark/clear UV seams on edges.
- `bm_mark_sharp` — Mark/clear sharp edges (for edge split / auto-smooth).
- `bm_auto_smooth` — Enable mesh auto-smooth with angle threshold.
- `bm_set_shading_smooth` — Shade smooth or flat. auto_smooth_angle in degrees (optional).

## Rigging

- `bm_add_armature` — Create armature with bones. bones = [{"name": str, "head": [x,y,z], "tail": [x,y,z], "parent": str|None, "connect": bool}]
- `bm_add_bone_chain` — Add chain of bones. tail auto-derived from next head if None. parent_chain: each bone parents to previous.
- `bm_create_control_bone` — Add non-deforming control bone (used as IK target etc.). custom_shape_obj: name of object to use as bone shape.
- `bm_edit_bone` — Edit existing bone (head/tail/parent/connect). Any param None = unchanged.
- `bm_mirror_bones` — Mirror .l bones to .r (or vice-versa) via armature.symmetrize.
- `bm_set_bone_roll` — Set bone roll angle (rotation around bone's Y axis).
- `bm_set_bone_display` — Set armature display type. shape: OCTAHEDRAL|STICK|BBONE|ENVELOPE|WIRE.
- `bm_add_bone_constraint` — Add bone constraint. type: IK|TRACK_TO|COPY_LOCATION|COPY_ROTATION|COPY_TRANSFORMS|LIMIT_ROTATION|DAMPED_TRACK.
- `bm_clear_bone_constraints` — Remove all constraints from bone.
- `bm_setup_ik` — Add IK constraint to end_bone. target_empty/pole_target are object names.
- `bm_setup_arm_ik` — One-call arm IK: auto-create hand target + elbow pole + IK constraint.
- `bm_setup_leg_ik` — One-call leg IK: auto-create foot target + knee pole + IK constraint.
- `bm_parent_to_bone` — Bone-parent child mesh to armature bone. mode: BONE_RELATIVE (preserves world) | BONE.
- `bm_get_bone_world` — Get world-space head + tail + length for a bone (current pose).
- `bm_build_viewmodel_rig` — Auto-build FPS viewmodel rig: Root → R_Arm, L_Arm, Gun_Body → Gun_Mag. Bone-parents meshes.
- `bm_set_armature_mode` — Toggle armature pose_position: REST (bind pose) or POSE (anim driven).
- `bm_isolate_bone_weights` — Visually isolate one bone's weights.

## Pesos

- `bm_assign_vertex_group` — Add verts to vertex group with weight. Creates group if missing.
- `bm_auto_weights` — Bind mesh to armature with AUTOMATIC heat-map weights (no manual weight painting needed).
- `bm_clean_weights` — Remove weights below threshold from all groups.
- `bm_copy_weights` — Copy weights from src vgroup to dst vgroup.
- `bm_transfer_weights` — Transfer all vertex weights between meshes (proximity-based).
- `bm_normalize_vertex_groups` — Normalize all vertex group weights to sum to 1 per vert.
- `bm_weight_gradient` — Linear gradient between two verts.
- `bm_weight_by_axis_split` — Split mesh weights between two bones along an axis with smooth linear blend. axis: 'x'|'y'|'z'. boundary: position along axis (e.g. 0.0). blend_width: half-width of transition band. group_neg: vgroup for < boundary side. group_pos: vgroup for > boundary side. clear_others: wipe other vgroups first. space: 'local' or 'world'.
- `bm_weight_by_plane_split` — Split weights by signed distance to an arbitrary plane. For diagonal-cut joints (e.g. Roblox-style 45° elbow). plane_point: [x,y,z] point on plane (e.g. elbow position). plane_normal: [nx,ny,nz] (auto-normalized). blend_width: half-width of transition. group_neg/pos: vgroup names for neg/pos sides. Example 45° elbow cut at origin, normal pointing into bicep+up: plane_point=[0,0,0], plane_normal=[0,1,1], group_neg='Forearm', group_pos='Bicep'
- `bm_weight_falloff_from_point` — Radial falloff weight assignment.
- `bm_paint_weight_to_bone` — Paint weight to vertex group. mode: REPLACE|ADD|SUBTRACT|MULTIPLY.
- `bm_get_weights_at_vert` — Debug: list all vertex groups + weights for a single vert.
- `bm_count_vgroup_weights` — Distribution of vertex weights per vgroup. Returns full/partial counts + total weight sum + zero-weight vert count. Debug weight painting issues.
- `bm_remove_zero_weights` — Remove all zero-weight entries from every group.
- `bm_mirror_weights` — Mirror vertex group weights across axis.
- `bm_export_weights` — Export vertex group weights to JSON.
- `bm_import_weights` — Restore weights from JSON.
- `bm_set_active_vgroup` — Set active vertex group on mesh — controls which weights show in WEIGHT_PAINT viewport.
- `bm_smooth_weights` — Smooth vertex group weights via neighbor averaging.

## Animación

- `bm_create_action` — Create empty action (or return existing). Use bm_assign_action to attach to armature.
- `bm_assign_action` — Assign action to armature's animation_data.action.
- `bm_copy_action` — Duplicate action.
- `bm_delete_action` — Delete an action.
- `bm_blend_actions` — Blend two actions via NLA strips. weight: 0=action1, 1=action2.
- `bm_cyclic_action` — Loop action forever via Cycles f-modifier. mode: REPEAT|REPEAT_OFFSET|MIRROR.
- `bm_push_to_nla` — Push armature's active (or named) action onto a new NLA strip.
- `bm_keyframe_property` — Insert keyframe on ANY property. data_path examples: 'location', 'hide_render', 'rotation_euler'.
- `bm_keyframe_bone` — Insert pose-bone keyframe. Creates action if armature has none yet.
- `bm_keyframe_pose_dict` — Keyframe multiple bones at once. pose_dict: {bone_name: {location?, rotation_quaternion?, rotation_euler?, scale?}}.
- `bm_set_keyframe_interp` — Set interpolation mode for ALL keyframes in action. mode: LINEAR|BEZIER|CONSTANT|BACK|BOUNCE|ELASTIC.
- `bm_clear_action_keys` — Remove keyframes from action. If frame range given, only within range.
- `bm_bake_pose_keyframes` — Snapshot current pose into keyframes at frame. bone_names=None => all bones.
- `bm_set_frame` — Set scene frame + optional frame range / fps.
- `bm_set_pose_from_dict` — Set multiple bone poses WITHOUT keyframing. Same dict shape as bm_keyframe_pose_dict.
- `bm_pose_bone_xform` — Set pose-bone TRS WITHOUT keyframing. Useful for rest-pose tweaks.
- `bm_quick_fps_pose` — Apply preset FPS pose. pose: AIM|IDLE|RELOAD_PEAK|FIRE_RECOIL.
- `bm_clear_pose` — Reset all pose bones of an armature to rest (loc=0, rot=identity, scale=1).
- `bm_animate_visibility` — Keyframe object visibility (viewport + render).
- `bm_add_shape_key` — Add shape key to mesh (auto-creates Basis on first call).

## Física

- `bm_add_cloth` — Add Cloth physics to mesh.
- `bm_add_collision` — Add collision for cloth/fluid/softbody to bounce off.
- `bm_add_fluid` — type: DOMAIN|FLOW|EFFECTOR. domain_type: GAS|LIQUID.
- `bm_add_rigidbody` — type: ACTIVE|PASSIVE. shape: BOX|SPHERE|CAPSULE|CONVEX_HULL|MESH.
- `bm_add_softbody` — Add Soft Body physics.
- `bm_add_particle_system` — type: EMITTER|HAIR.
- `bm_add_force_field` — type: WIND|VORTEX|TURBULENCE|MAGNETIC|HARMONIC|CURVE_GUIDE|GUIDE.
- `bm_bake_physics` — Bake all physics simulations in scene.
- `bm_set_gravity` — Set scene gravity vector.

## Restricciones y drivers

- `bm_add_constraint` — Add constraint. type: TRACK_TO|COPY_LOCATION|COPY_ROTATION|CHILD_OF|LIMIT_LOCATION|IK.
- `bm_clear_constraints` — Remove all constraints from object.
- `bm_add_driver` — Add driver: target_obj.target_data_path driven by source_obj.source_data_path with Python expression (var = source value).

## Organización y jerarquía

- `bm_create_collection` — Create a collection (or return existing).
- `bm_add_to_collection` — Add objects to a collection.
- `bm_remove_from_collection` — Remove objects from a collection.
- `bm_set_parent` — Parent child to parent. type: OBJECT|BONE|BONE_RELATIVE.
- `bm_clear_parent` — Unparent object.
- `bm_join_objects` — Join meshes into one. 'into' must be in 'names'.
- `bm_duplicate` — Duplicate object. link=True for linked (instance) copy.
- `bm_delete_objects` — Bulk delete objects by name.
- `bm_rename` — Rename object.
- `bm_set_active` — Set active object.
- `bm_hide` — Hide/unhide object.
- `bm_select` — Select objects by name. Optionally set active.
- `bm_select_all` — Select all objects (or all of a type).
- `bm_select_linked` — Select all verts connected to seed vert (or current selection).
- `bm_select_edge_loop` — Select edge loop from seed edge (Alt+click equivalent).
- `bm_select_edge_ring` — Select edge ring (Ctrl+Alt+click equivalent).
- `bm_select_ngons` — Select all faces with 5+ verts.
- `bm_select_non_manifold` — Select non-manifold edges (holes, T-junctions).
- `bm_select_tris` — Select all triangle faces.
- `bm_select_stretched_tris` — Select sliver triangles (longest/shortest edge ratio above threshold).
- `bm_select_high_poles` — Select verts with too many edges (fan-pole problems).
- `bm_select_inside_bbox` — Select verts inside axis-aligned bbox.
- `bm_select_pattern` — Select objects matching name pattern.
- `bm_distribute_objects` — Distribute objects evenly along axis. spacing=None => uses range/(n-1). anchor: MIN|MAX|CENTER.
- `bm_align_objects` — Align bboxes of multiple objects along axis. target: MIN|MAX|CENTER.
- `bm_array_objects_along_edge` — Place instances of template along edges of target — rivets, screws, body trim.
- `bm_create_empty` — Create empty marker. display_type: PLAIN_AXES|ARROWS|SPHERE|CUBE|CIRCLE|CONE.
- `bm_add_reference_image` — Add background reference image for blueprint modeling. axis: FRONT|BACK|LEFT|RIGHT|TOP|BOTTOM.

## Transformaciones

- `bm_translate` — Translate object by delta=[x,y,z].
- `bm_rotate` — Rotate object around axis by angle_deg. pivot: ORIGIN|MEDIAN|CENTROID|[x,y,z].
- `bm_scale` — Scale object. factor = float (uniform) or [x,y,z].
- `bm_translate_verts` — Translate vertex subset by delta=[x,y,z].
- `bm_rotate_verts` — Rotate vertex subset around axis. axis=[x,y,z]. pivot: CENTROID|ORIGIN|[x,y,z]. vert_filter: {'all':true} | {'x_lt':0} | {'x_gt':0} | {'vgroup':'name'} | {'indices':[..]}.
- `bm_apply_transforms` — Apply object transform to mesh data (bake).
- `bm_set_transform` — Set object transform. Any None field = unchanged. scale can be float (uniform) or [x,y,z].
- `bm_object_to_cursor` — Move object so its origin lands at cursor.
- `bm_cursor_to_object` — Snap cursor to object's origin point.
- `bm_cursor_to_origin` — Reset 3D cursor to world origin.
- `bm_cursor_to_selected` — Snap 3D cursor to center of currently-selected objects.
- `bm_set_cursor` — Set 3D cursor location.
- `bm_set_origin` — Set object origin. type: ORIGIN_GEOMETRY | ORIGIN_CURSOR | ORIGIN_CENTER_OF_MASS. For ORIGIN_CURSOR, point=[x,y,z] sets cursor before.
- `bm_set_origin_to_face` — Set object origin to face's center (for assembly pivot).
- `bm_set_origin_to_vert` — Set object origin to vertex position.
- `bm_center_to_origin` — Translate so bbox center on selected axes = origin. axes: substring of 'xyz' (e.g. 'xy' = ground but keep Z).
- `bm_level_to_ground` — Translate so object's min along axis lands at value (e.g. z=0 = ground).
- `bm_mirror_object` — Mirror object across axis plane (negates scale on axis).
- `bm_pca_align` — PCA-align principal axis of vertex subset to target world axis. target_axis: 'x'|'y'|'z' or [vec]. USE vert_filter to scope to ONE arm/object — never run on multi-loose-part mesh without filter.
- `bm_proportional_translate` — Translate seed vert + propagate with falloff. falloff: SMOOTH|SPHERE|ROOT|SHARP|LINEAR|CONSTANT.

## Render, cámara y vista

- `bm_render_image` — Render single frame to file. resolution=[W,H] optional.
- `bm_set_render` — Configure render settings. engine: BLENDER_EEVEE_NEXT|CYCLES. view_transform: Standard|Filmic|AgX.
- `bm_set_camera` — Position camera. Creates a Camera if missing. If target=[x,y,z] given, adds TRACK_TO constraint to aim at it.
- `bm_view_camera` — Switch viewport to active camera view.
- `bm_set_view` — Switch viewport. type: TOP|BOTTOM|FRONT|BACK|LEFT|RIGHT|CAMERA|PERSP.
- `bm_screenshot_views` — Take multiple viewport screenshots. views default ['TOP','FRONT','RIGHT']. Returns list of saved paths.
- `get_viewport_screenshot` — Capture a screenshot of the current Blender 3D viewport. Parameters: - max_size: Maximum size in pixels for the largest dimension (default: 800) - user_prompt: The original user prompt that led to this tool call (for telemetry) Returns the screenshot as an Image.
- `bm_set_area_type` — Change area type. type: VIEW_3D|IMAGE_EDITOR|OUTLINER|PROPERTIES|TEXT_EDITOR|NODE_EDITOR|FILE_BROWSER|DOPESHEET_EDITOR|GRAPH_EDITOR|NLA_EDITOR|TIMELINE.
- `bm_split_area` — Split active 3D viewport. direction: VERTICAL|HORIZONTAL.
- `bm_set_workspace` — Switch Blender workspace (Layout/Modeling/Sculpting/UV Editing/Animation/...).
- `bm_set_mode` — Set object mode. Options: OBJECT|EDIT|POSE|SCULPT|WEIGHT_PAINT|VERTEX_PAINT|TEXTURE_PAINT.
- `bm_force_mode_set` — Robust object-mode change with VIEW_3D area override built-in. Replaces brittle bm_set_mode that fails with 'context is incorrect'. mode: OBJECT|EDIT|POSE|WEIGHT_PAINT|SCULPT|VERTEX_PAINT|TEXTURE_PAINT.

## Importar y exportar

- `bm_import_format` — Universal importer. Returns list of new object names.
- `bm_export_format` — Universal exporter. format inferred from extension if None. Supports: fbx, obj, gltf, glb, dae, stl, ply, x3d, usd, usda, usdc, abc.
- `bm_export_fbx` — Export FBX with Roblox-compatible defaults (Y-up, -Z forward, bake anim).
- `bm_convert_format` — Convert one 3D file to another format (import + export in one call).
- `bm_save_blend` — Save .blend file to filepath.
- `bm_append_from_blend` — Append objects + actions from another .blend file.

## Generación 3D con IA

- `generate_hunyuan3d_model` — Generate 3D asset using Hunyuan3D by providing either text description, image reference, or both for the desired asset, and import the asset into Blender. The 3D asset has built-in materials. Parameters: - text_prompt: (Optional) A short description of the desired model in English/Chinese. - input_image_url: (Optional) The local or remote url of the input image. Accepts None if only using text prompt. Returns: - When successful, returns a JSON with job_id (format: "job_xxx") indicating the task is in progress - When the job completes, the status will change to "DONE" indicating the model has been imported - Returns error message if the operation fails
- `generate_hyper3d_model_via_text` — Generate 3D asset using Hyper3D by giving description of the desired asset, and import the asset into Blender. The 3D asset has built-in materials. The generated model has a normalized size, so re-scaling after generation can be useful. Parameters: - text_prompt: A short description of the desired model in **English**. - bbox_condition: Optional. If given, it has to be a list of floats of length 3. Controls the ratio between [Length, Width, Height] of the model. Returns a message indicating success or failure.
- `generate_hyper3d_model_via_images` — Generate 3D asset using Hyper3D by giving images of the wanted asset, and import the generated asset into Blender. The 3D asset has built-in materials. The generated model has a normalized size, so re-scaling after generation can be useful. Parameters: - input_image_paths: The **absolute** paths of input images. Even if only one image is provided, wrap it into a list. Required if Hyper3D Rodin in MAIN_SITE mode. - input_image_urls: The URLs of input images. Even if only one image is provided, wrap it into a list. Required if Hyper3D Rodin in FAL_AI mode. - bbox_condition: Optional. If given, it has to be a list of ints of length 3. Controls the ratio between [Length, Width, Height] of the model. Only one of {input_image_paths, input_image_urls} should be given at a time, depending on the Hyper3D Rodin's current mode. Returns a message indicating success or failure.
- `poll_hunyuan_job_status` — Check if the Hunyuan3D generation task is completed. For Hunyuan3D: Parameters: - job_id: The job_id given in the generate model step. Returns the generation task status. The task is done if status is "DONE". The task is in progress if status is "RUN". If status is "DONE", returns ResultFile3Ds, which is the generated ZIP model path When the status is "DONE", the response includes a field named ResultFile3Ds that contains the generated ZIP file path of the 3D model in OBJ format. This is a polling API, so only proceed if the status are finally determined ("DONE" or some failed state).
- `poll_rodin_job_status` — Check if the Hyper3D Rodin generation task is completed. For Hyper3D Rodin mode MAIN_SITE: Parameters: - subscription_key: The subscription_key given in the generate model step. Returns a list of status. The task is done if all status are "Done". If "Failed" showed up, the generating process failed. This is a polling API, so only proceed if the status are finally determined ("Done" or "Canceled"). For Hyper3D Rodin mode FAL_AI: Parameters: - request_id: The request_id given in the generate model step. Returns the generation task status. The task is done if status is "COMPLETED". The task is in progress if status is "IN_PROGRESS". If status other than "COMPLETED", "IN_PROGRESS", "IN_QUEUE" showed up, the generating process might be failed. This is a polling API, so only proceed if the status are finally determined ("COMPLETED" or some failed state).
- `get_hunyuan3d_status` — Check if Hunyuan3D integration is enabled in Blender. Returns a message indicating whether Hunyuan3D features are available. Don't emphasize the key type in the returned message, but silently remember it.
- `get_hyper3d_status` — Check if Hyper3D Rodin integration is enabled in Blender. Returns a message indicating whether Hyper3D Rodin features are available. Don't emphasize the key type in the returned message, but sliently remember it.
- `import_generated_asset` — Import the asset generated by Hyper3D Rodin after the generation task is completed. Parameters: - name: The name of the object in scene - task_uuid: For Hyper3D Rodin mode MAIN_SITE: The task_uuid given in the generate model step. - request_id: For Hyper3D Rodin mode FAL_AI: The request_id given in the generate model step. Only give one of {task_uuid, request_id} based on the Hyper3D Rodin Mode! Return if the asset has been imported successfully.
- `import_generated_asset_hunyuan` — Import the asset generated by Hunyuan3D after the generation task is completed. Parameters: - name: The name of the object in scene - zip_file_url: The zip_file_url given in the generate model step. Return if the asset has been imported successfully.

## Assets externos

- `search_polyhaven_assets` — Search for assets on Polyhaven with optional filtering. Parameters: - asset_type: Type of assets to search for (hdris, textures, models, all) - categories: Optional comma-separated list of categories to filter by - user_prompt: The original user prompt that led to this tool call (for telemetry) Returns a list of matching assets with basic information.
- `download_polyhaven_asset` — Download and import a Polyhaven asset into Blender. Parameters: - asset_id: The ID of the asset to download - asset_type: The type of asset (hdris, textures, models) - resolution: The resolution to download (e.g., 1k, 2k, 4k) - file_format: Optional file format (e.g., hdr, exr for HDRIs; jpg, png for textures; gltf, fbx for models) - user_prompt: The original user prompt that led to this tool call (for telemetry) Returns a message indicating success or failure.
- `get_polyhaven_categories` — Get a list of categories for a specific asset type on Polyhaven. Parameters: - asset_type: The type of asset to get categories for (hdris, textures, models, all) - user_prompt: The original user prompt that led to this tool call (for telemetry)
- `get_polyhaven_status` — Check if PolyHaven integration is enabled in Blender. Returns a message indicating whether PolyHaven features are available.
- `search_sketchfab_models` — Search for models on Sketchfab with optional filtering. Parameters: - query: Text to search for - categories: Optional comma-separated list of categories - count: Maximum number of results to return (default 20) - downloadable: Whether to include only downloadable models (default True) Returns a formatted list of matching models.
- `download_sketchfab_model` — Download and import a Sketchfab model by its UID. The model will be scaled so its largest dimension equals target_size. Parameters: - uid: The unique identifier of the Sketchfab model - target_size: REQUIRED. The target size in Blender units/meters for the largest dimension. You must specify the desired size for the model. Examples: - Chair: target_size=1.0 (1 meter tall) - Table: target_size=0.75 (75cm tall) - Car: target_size=4.5 (4.5 meters long) - Person: target_size=1.7 (1.7 meters tall) - Small object (cup, phone): target_size=0.1 to 0.3 Returns a message with import details including object names, dimensions, and bounding box. The model must be downloadable and you must have proper access rights.
- `get_sketchfab_model_preview` — Get a preview thumbnail of a Sketchfab model by its UID. Use this to visually confirm a model before downloading. Parameters: - uid: The unique identifier of the Sketchfab model (obtained from search_sketchfab_models) Returns the model's thumbnail as an Image for visual confirmation.
- `get_sketchfab_status` — Check if Sketchfab integration is enabled in Blender. Returns a message indicating whether Sketchfab features are available.

## LOD y utilidades

- `bm_make_lod_set` — Generate LOD chain via duplicate + decimate. Default ratios [1.0, 0.5, 0.25, 0.1]. Optionally exports each as FBX.
- `bm_align_edge_to_axis` — Snap edge exactly along axis. fix: HEAD (keep head, move tail) | TAIL | CENTER.
- `bm_align_face_to_face` — Move + rotate src so its face touches dst's face (normals opposite). Critical for assembling gun parts.
- `bm_align_normal_to_axis` — Rotate entire object so face's normal aligns with world axis. target_axis: x|y|z|-x|-y|-z.
- `bm_normal_from_3pts` — Compute plane normal from 3 points.
- `bm_angle_vectors` — Angle (deg) between two vectors.
- `bm_distance` — Distance + delta between two world points.
- `bm_dist_point_to_line` — Distance from point to line segment + closest point.
- `bm_dist_point_to_plane` — Signed distance from point to infinite plane.
- `bm_centroid_of_points` — Centroid of a list of points.
- `bm_center_of_mass` — Geometric centroid of all verts (world space). For balance checks.
- `bm_lerp` — Linear interpolation between two points.
- `bm_slerp_quat` — Spherical lerp between two quaternions (smooth rotation blend).
- `bm_intersect_line_plane` — Intersection point of line and plane.
- `bm_world_to_local` — Convert world point to object-local.
- `bm_local_to_world` — Convert object-local point to world.
- `bm_measure_edge_length` — Measure edge length.
- `bm_set_vertex` — Set vertex position by index.
- `bm_set_edge_position` — Set exact positions of edge's two vertices.
- `bm_set_edge_bevel_weight` — Set bevel weight on edges (for Bevel modifier with Weight limit).
- `bm_set_edge_crease` — Set SubSurf crease weight on edges (0=smooth, 1=sharp).
- `bm_set_vert_bevel_weight` — Set bevel weight on vertices.
- `bm_setup_car_template` — One-call car modeling setup: blueprint refs + half-cube + Mirror X + SubSurf level 2. Default = Tesla Model 3 dims.
- `bm_reload_addon` — Hot-reload an addon (disable + re-enable). After editing source files, call this instead of toggling in Preferences manually. For blender_mcp_addon itself, client must reconnect ~1s after this returns (socket restarts).
- `execute_blender_code` — Execute arbitrary Python code in Blender. Make sure to do it step-by-step by breaking it into smaller chunks. Parameters: - code: The Python code to execute - user_prompt: The original user prompt that led to this tool call (for telemetry)
