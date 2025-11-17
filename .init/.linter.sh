#!/bin/bash
cd /home/kavia/workspace/code-generation/academic-learning-management-system-255329-256060/lms_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

