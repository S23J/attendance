import React, { useMemo } from 'react'
import ExportExcel from '../../ExportExcel';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { BsPrinter } from "react-icons/bs";
import { GoInfo } from 'react-icons/go';
import { ActionIcon, Box, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function TabAbsenMasuk ( {
    absensiMasuk,
    karyawanid,
    userDetail,
    formattedTotalLateDuration,
    handleAbsensiDetail
} )
{

    const navigate = useNavigate();

    const printAbsensi = () =>
    {
        navigate( "/absen-masuk/" + karyawanid );
    }

    const columns = useMemo(
        () => [
            {
                header: 'Detail',
                accessorFn: row => (
                    <div >
                        <GoInfo
                            size={ 20 }
                            onClick={ () => handleAbsensiDetail( row ) }
                            style={ { cursor: 'pointer' } }
                        />

                    </div>
                ),
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
                },
                size: 100,
            },
            {
                header: 'Tanggal',
                accessorFn: ( row ) => new Date( row.checkin_time ),
                filterVariant: 'date-range',
                Cell: ( { cell } ) => cell.getValue().toLocaleDateString(),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Jam',
                accessorFn: ( row ) => (
                    row.checkin_time.split( 'T' )[ 1 ].split( '.' )[ 0 ]
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Telat',
                accessorKey: 'late_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },

        ],
        [],
    );

    const handleExportRowsExcelData = () =>
    {
        const excelData = table.getRowModel().rows.map( ( row ) =>
        {
            const { original } = row;
            return {
                'Absen Masuk': original.checkin_time,
                'Keterlambatan': original.late_duration,
                'Total Keterlambatan': formattedTotalLateDuration,
            };
        } );

        return excelData;
    };


    const table = useMantineReactTable( {
        columns,
        enableDensityToggle: false,
        initialState: { density: 'xs' },
        data: absensiMasuk,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        enableGlobalFilter: false,
        enableColumnResizing: false,
        isMultiSortEvent: () => true,
        mantineTableProps: {
            striped: true,

        },
        renderTopToolbarCustomActions: ( { table } ) => (
            <Box
                sx={ {
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                } }
            >
            </Box>
        ),
        //customize built-in buttons in the top-right of top toolbar
        renderToolbarInternalActions: ( { table } ) => (
            <Flex gap="xs" align="center">
                {/* add custom button to print table  */ }
                <ActionIcon
                    onClick={ printAbsensi }
                >
                    <BsPrinter
                        style={ { backgroundColor: 'transparent', color: '#222' } }
                        size={ 40 }
                    />
                </ActionIcon>
                <ActionIcon>
                    <ExportExcel
                        excelData={ handleExportRowsExcelData( table.getRowModel().rows ) }
                        fileName={ `Data Absensi Masuk ${userDetail?.first_name} ${userDetail?.last_name}` }
                    />
                </ActionIcon>
            </Flex>
        ),
    } );

    return (
        <div>
            <MantineReactTable
                table={ table }
            />
        </div>
    )
}

export default TabAbsenMasuk
