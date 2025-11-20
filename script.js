        // Estado de la aplicación
        let selectedSpells = [];
        const MAX_SPELLS = 4;

        // Referencias al DOM
		const classSelect = document.getElementById('classSelect');
        const spellSelect = document.getElementById('spellSelect');
        const spellListContainer = document.getElementById('spellList');
        const output = document.getElementById('macroOutput');
        const commandSelect = document.getElementById('commandType');
        const conditionSelect = document.getElementById('conditionSelect');
        const selfCastContainer = document.getElementById('selfCastContainer');
        const selfCastCheckbox = document.getElementById('selfCastCheckbox');

        // Función para mostrar/ocultar la opción de autolanzamiento
        function toggleSelfCastOption() {
            const selectedCondition = conditionSelect.value;
            if (selectedCondition === "[@mouseover,help,nodead][help,nodead]") {
                selfCastContainer.style.display = "block";
            } else {
                selfCastContainer.style.display = "none";
                selfCastCheckbox.checked = false; // Resetear si se oculta
            }
        }
		
		// NUEVA FUNCIÓN: Se ejecuta al cambiar la clase en el HTML (onchange)
		function changeClass() {
			const selectedClass = classSelect.value;
    
		// 1. Limpiar la lista de hechizos seleccionados actualmente
		selectedSpells = [];
		renderSpells();
    
		// 2. Cargar las habilidades para la nueva clase
		loadSpells(selectedClass);
    
		// 3. (Opcional) Actualizar el título
		document.querySelector('h1').textContent = `Generador de Macros para ${selectedClass}`;
    
		// 4. Asegurarse de ocultar la opción de autocasteo (por si se seleccionó antes)
		toggleSelfCastOption();
		}
		
		// FUNCIÓN MODIFICADA: Ahora recibe el nombre de la clase
		function loadSpells(className) {
		// 1. Limpiar todas las opciones anteriores, excepto la primera ("Selecciona una habilidad...")
		while (spellSelect.options.length > 1) {
			spellSelect.remove(1);
		}
    
		// 2. Obtener los datos de hechizos para la clase seleccionada (CLASS_SPELLS viene de spells_data.js)
		const spellsData = CLASS_SPELLS[className]; 
		if (!spellsData) return; // Salir si no hay datos para esa clase

		// 3. Recorrer las categorías y añadir las opciones al select
		spellsData.forEach(group => { 
			if (group.spells && group.spells.length > 0) {
			group.spells.forEach(spellName => {
				const option = document.createElement('option');
				option.value = spellName;
				option.textContent = spellName; 
				spellSelect.appendChild(option);
			});
		}
	});
}

        // Función para añadir hechizo
        function addSpell() {
            const spell = spellSelect.value;
            
            if (!spell) return;

            if (selectedSpells.length >= MAX_SPELLS) {
                alert("¡Solo puedes elegir un máximo de " + MAX_SPELLS + " habilidades!");
                return;
            }

            selectedSpells.push(spell);
            renderSpells();
            spellSelect.value = "";
        }

        // Función para eliminar hechizo de la lista
        function removeSpell(index) {
            selectedSpells.splice(index, 1);
            renderSpells();
        }

        // Renderizar visualmente los tags
        function renderSpells() {
            spellListContainer.innerHTML = "";
            selectedSpells.forEach((spell, index) => {
                const tag = document.createElement('div');
                tag.className = 'spell-tag';
                tag.innerHTML = `
                    ${spell}
                    <span class="remove" onclick="removeSpell(${index})">✕</span>
                `;
                spellListContainer.appendChild(tag);
            });
        }

        // Lógica principal del generador (ACTUALIZADA)
        function generateMacro() {
            if (selectedSpells.length === 0) {
                output.value = "Por favor, selecciona al menos una habilidad.";
                return;
            }

            const command = commandSelect.value; // /cast o /castsequence
            const condition = conditionSelect.value; // @mouseover o @mouseover,help,nodead help,nodead
            
            // Cadena de hechizos
            const spellsString = selectedSpells.join(", ");

            // Construcción base
            let macro = `#showtooltip\n${command} ${condition} ${spellsString}`;

            // Lógica condicional para agregar el fallback al jugador
            // Si estamos en modo help,nodead Y el checkbox está marcado
            if (condition === "[@mouseover,help,nodead][help,nodead]" && selfCastCheckbox.checked) {
                macro += `; [@player] ${spellsString}`;
            }
            
            output.value = macro;
        }

        // Copiar al portapapeles
        function copyToClipboard() {
            output.select();
            document.execCommand("copy");
            const btn = document.querySelector('.btn-copy');
            const originalText = btn.innerText;
            btn.innerText = "¡Copiado!";
            setTimeout(() => {
                btn.innerText = originalText;
            }, 2000);
        }

// Llama a la función de carga al final del script para que se ejecute cuando cargue la página
loadSpells(classSelect.value);